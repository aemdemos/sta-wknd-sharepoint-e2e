/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get all direct children of the contentfragment
  const children = Array.from(contentFragment.children);

  // Find all h2s (accordion section titles)
  const h2s = children.map((n, idx) => n.tagName === 'H2' ? { node: n, idx } : null).filter(Boolean);
  const accordionSections = [];

  // Add intro section (before first h2)
  if (h2s.length > 0 && h2s[0].idx > 0) {
    const introNodes = [];
    for (let i = 0; i < h2s[0].idx; i++) {
      const n = children[i];
      if (!n) continue;
      // Include all non-empty elements (paragraphs, images, etc.)
      if (n.tagName === 'P' && n.textContent.trim()) {
        introNodes.push(n.cloneNode(true));
      } else if (n.tagName === 'DIV') {
        // Add all .image wrappers inside this div
        n.querySelectorAll('.image').forEach(imgWrap => {
          introNodes.push(imgWrap.cloneNode(true));
        });
      }
    }
    if (introNodes.length) {
      const introTitle = 'Introduction';
      let introContent;
      if (introNodes.length === 1) {
        introContent = introNodes[0];
      } else {
        const wrapper = document.createElement('div');
        introNodes.forEach(n => wrapper.appendChild(n));
        introContent = wrapper;
      }
      accordionSections.push([introTitle, introContent]);
    }
  }

  // For each h2, get content until next h2
  for (let h = 0; h < h2s.length; h++) {
    const curr = h2s[h];
    const next = h2s[h + 1];
    const title = curr.node.textContent.trim();
    const contentNodes = [];
    for (let i = curr.idx + 1; i < (next ? next.idx : children.length); i++) {
      const n = children[i];
      if (!n) continue;
      if (n.tagName === 'P' && n.textContent.trim()) {
        contentNodes.push(n.cloneNode(true));
      } else if (n.tagName === 'DIV') {
        n.querySelectorAll('.image').forEach(imgWrap => {
          contentNodes.push(imgWrap.cloneNode(true));
        });
      }
    }
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n));
      contentCell = wrapper;
    } else {
      contentCell = document.createElement('div');
    }
    accordionSections.push([title, contentCell]);
  }

  // Table header
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];
  accordionSections.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
