/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (where the surf spots are)
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;

  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Get all direct children (including text nodes so we don't miss text)
  const nodes = Array.from(elementsContainer.childNodes);
  const cells = [];
  // Header row as in the example
  cells.push(['Accordion (accordion8)']);

  // Helper: collect all nodes between start (exclusive) and next H2 (exclusive)
  function collectSpotContent(startIdx, nodes) {
    const contentElements = [];
    let idx = startIdx;
    while (idx < nodes.length) {
      const node = nodes[idx];
      if (node.nodeType === 1 && node.tagName === 'H2') {
        break;
      }
      // For element nodes
      if (node.nodeType === 1) {
        // If it's an aem-Grid (may contain images), flatten any images inside
        if (node.classList && node.classList.contains('aem-Grid')) {
          const imgs = node.querySelectorAll('.cmp-image');
          imgs.forEach(img => contentElements.push(img));
        } else if (node.classList && node.classList.contains('image')) {
          const img = node.querySelector('.cmp-image');
          if (img) contentElements.push(img);
        } else if (node.classList && node.classList.contains('cmp-image')) {
          contentElements.push(node);
        } else if (node.tagName === 'P' || node.tagName.match(/^H[1-6]$/)) {
          contentElements.push(node);
        } else if (node.childNodes && node.childNodes.length > 0) {
          // Some divs may wrap useful content
          Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
              contentElements.push(child);
            }
          });
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // For text nodes with content
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        contentElements.push(p);
      }
      idx++;
    }
    // Remove empty nodes
    return contentElements.filter(e => {
      if (e.nodeType === 3) return !!e.textContent.trim();
      if (e.nodeType === 1) {
        if (e.tagName === 'DIV' && e.innerHTML.trim() === '') return false;
        if (e.tagName === 'P' && e.textContent.trim() === '') return false;
        if (e.tagName === 'SPAN' && e.textContent.trim() === '') return false;
      }
      return true;
    });
  }

  // Find each <h2>, treat as accordion title, grab its following content
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      const title = node.textContent.trim();
      const contentArr = collectSpotContent(i + 1, nodes);
      let cellContent;
      if (contentArr.length === 1) {
        cellContent = contentArr[0];
      } else if (contentArr.length > 1) {
        cellContent = contentArr;
      } else {
        cellContent = '';
      }
      cells.push([title, cellContent]);
      // Find next h2 or end
      let j = i + 1;
      while (j < nodes.length) {
        const n = nodes[j];
        if (n.nodeType === 1 && n.tagName === 'H2') break;
        j++;
      }
      i = j;
    } else {
      i++;
    }
  }

  // Replace the original element with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
