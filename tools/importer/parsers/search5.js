/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section inside the grid
  let searchSection = null;
  const grid = element.querySelector('.aem-Grid');
  if (grid) {
    const children = grid.querySelectorAll(':scope > div');
    for (const child of children) {
      if (child.classList.contains('search')) {
        searchSection = child.querySelector('section.cmp-search');
        break;
      }
    }
  }
  if (!searchSection) return;

  // Find the form in the search section
  const form = searchSection.querySelector('form');
  let absUrl = '';
  if (form && form.hasAttribute('action')) {
    const action = form.getAttribute('action');
    try {
      let url;
      if (/^https?:\/\//.test(action)) {
        url = new URL(action);
      } else {
        const base = document.location ? document.location.origin : window.location.origin;
        url = new URL(action, base);
      }
      url.pathname = url.pathname.substring(0, url.pathname.lastIndexOf('/')) + '/query-index.json';
      url.search = '';
      absUrl = url.href;
    } catch (e) {
      absUrl = action.replace(/\/[^/]*$/, '/query-index.json');
    }
  }

  // Collect all relevant text content and UI elements from the search section
  // We'll include only the form (with all inputs and labels),
  // and any text directly inside the search section that isn't part of the form or results
  const contentArr = [];
  // Add any text nodes or elements that are direct children (not form or results)
  Array.from(searchSection.childNodes).forEach(node => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node !== form &&
      !node.classList.contains('cmp-search__results')
    ) {
      contentArr.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Add non-empty direct text
      contentArr.push(document.createTextNode(node.textContent));
    }
  });
  if (form) {
    contentArr.push(form);
  }

  // Add the query index link
  if (absUrl) {
    const a = document.createElement('a');
    a.href = absUrl;
    a.textContent = absUrl;
    contentArr.push(a);
  }

  // Create the block table matching the example
  const cells = [
    ['Search'],
    [contentArr]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
