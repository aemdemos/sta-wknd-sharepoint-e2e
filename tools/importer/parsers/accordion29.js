/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  const headerRow = ['Accordion (accordion29)'];
  const rows = [];

  // Find the wrapper for the content fragment elements
  const elementsWrapper = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrapper) return;

  // Get all children, filtering out empty text nodes
  const children = Array.from(elementsWrapper.childNodes).filter(node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));

  // Helper: Remove empty grid wrappers and grid columns
  function filterContentNodes(nodes) {
    return nodes.filter(node => {
      if (node.nodeType === 3) return node.textContent.trim();
      if (node.nodeType === 1 && node.tagName === 'DIV') {
        // Remove empty grid divs
        if (node.innerHTML.trim() === '') return false;
        // Remove grid divs that only contain empty grid columns
        const onlyEmptyGrid = Array.from(node.children).every(child => child.innerHTML.trim() === '');
        if (onlyEmptyGrid) return false;
      }
      return true;
    });
  }

  // Find all h2 sections for accordion items
  const sectionDivs = Array.from(elementsWrapper.querySelectorAll('div')).filter(div => div.querySelector('h2'));
  let lastIdx = 0;

  // If there is content before the first h2, treat it as the intro
  if (sectionDivs.length > 0) {
    const firstSectionIdx = children.findIndex(node => node === sectionDivs[0]);
    if (firstSectionIdx > 0) {
      // Use the main title as the first accordion title
      const mainTitle = contentFragment.querySelector('.cmp-contentfragment__title');
      let titleEl;
      if (mainTitle) {
        titleEl = mainTitle.cloneNode(true);
      } else {
        titleEl = document.createElement('span');
        titleEl.textContent = 'Introduction';
      }
      const introContent = filterContentNodes(children.slice(0, firstSectionIdx));
      if (introContent.length > 0) {
        rows.push([titleEl, introContent]);
      }
      lastIdx = firstSectionIdx;
    }
  }

  // For each h2 section, collect all content until the next h2 section
  for (let s = 0; s < sectionDivs.length; s++) {
    const sectionDiv = sectionDivs[s];
    const titleEl = sectionDiv.querySelector('h2').cloneNode(true);
    const sectionIdx = children.findIndex(node => node === sectionDiv);
    let nextSectionIdx = children.length;
    if (s + 1 < sectionDivs.length) {
      nextSectionIdx = children.findIndex(node => node === sectionDivs[s + 1]);
    }
    // Content: everything from sectionDiv (excluding h2) up to nextSectionIdx
    let contentNodes = [];
    // Include all nodes in sectionDiv except the h2
    Array.from(sectionDiv.childNodes).forEach(node => {
      if (node.nodeType === 1 && node.tagName === 'H2') return;
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      contentNodes.push(node);
    });
    // Also include any siblings after sectionDiv up to nextSectionIdx
    for (let j = sectionIdx + 1; j < nextSectionIdx; j++) {
      contentNodes.push(children[j]);
    }
    contentNodes = filterContentNodes(contentNodes);
    // Only add row if content is not empty and not just empty wrappers
    if (contentNodes.length > 0 && contentNodes.some(node => {
      if (node.nodeType === 3 && node.textContent.trim()) return true;
      if (node.nodeType === 1 && node.innerHTML.trim() !== '') return true;
      return false;
    })) {
      rows.push([titleEl, contentNodes]);
    }
    lastIdx = nextSectionIdx;
  }

  // Defensive: If no rows found, fallback to all content
  if (rows.length === 0) {
    const allContent = filterContentNodes(Array.from(elementsWrapper.childNodes));
    rows.push([document.createTextNode('Content'), allContent]);
  }

  // Build the table cells: each row is [title, content]
  const cells = [headerRow, ...rows.map(([title, content]) => [title, Array.isArray(content) ? content : [content]])];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
