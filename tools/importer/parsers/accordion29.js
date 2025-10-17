/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion29)'];
  const rows = [headerRow];

  // Find the main content fragment/article for accordion items
  const contentFragment = element.querySelector('.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the content root
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsRoot) return;

  // Gather all children under elementsRoot
  const children = Array.from(elementsRoot.children);

  // Helper to collect content elements between two indices
  function collectContent(startIdx, endIdx) {
    const content = [];
    for (let i = startIdx; i < endIdx; i++) {
      const el = children[i];
      // If grid, add its children
      if (el.classList.contains('aem-Grid')) {
        Array.from(el.children).forEach(child => {
          if (child.childElementCount > 0 || child.textContent.trim()) {
            content.push(child);
          }
        });
      } else if (el.childElementCount > 0 || el.textContent.trim()) {
        content.push(el);
      }
    }
    return content;
  }

  // Find all h2s and their indices
  const h2s = [];
  children.forEach((el, idx) => {
    if (el.tagName === 'H2') {
      h2s.push({ el, idx });
    }
  });

  // If there is introductory content before the first h2, treat it as an accordion item
  if (h2s.length > 0 && h2s[0].idx > 0) {
    const introContent = collectContent(0, h2s[0].idx);
    if (introContent.length > 0) {
      // Use the main article title as the accordion title
      const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title')?.textContent || 'Introduction';
      const titleEl = document.createElement('span');
      titleEl.textContent = mainTitle;
      rows.push([titleEl, introContent]);
    }
  }

  // For each h2, collect content until the next h2
  for (let i = 0; i < h2s.length; i++) {
    const { el: h2, idx } = h2s[i];
    const nextIdx = (i + 1 < h2s.length) ? h2s[i + 1].idx : children.length;
    const content = collectContent(idx + 1, nextIdx);
    rows.push([h2, content]);
  }

  // Defensive: If no h2s, treat all as a single accordion item
  if (h2s.length === 0 && children.length > 0) {
    const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title')?.textContent || 'Content';
    const titleEl = document.createElement('span');
    titleEl.textContent = mainTitle;
    rows.push([titleEl, children]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
