/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section inside the provided element
  let searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) {
    // Try to find a section with 'search' in the class name
    searchSection = Array.from(element.querySelectorAll('section')).find(sec => (sec.className || '').includes('search'));
  }
  if (!searchSection) return;

  // Get the query index URL dynamically from the search form action attribute
  const form = searchSection.querySelector('form');
  let queryIndexUrl = '';
  if (form && form.hasAttribute('action')) {
    const action = form.getAttribute('action');
    // Find everything up to .searchresults.json
    const match = action.match(/^(.*?)[.]searchresults[.]json/);
    if (match) {
      let base = match[1];
      if (base.endsWith('/')) base = base.slice(0, -1);
      queryIndexUrl = `https://main--helix-block-collection--adobe.hlx.page${base}/query-index.json`;
    }
  }
  // Create a link element for the query index url
  let link = '';
  if (queryIndexUrl) {
    link = document.createElement('a');
    link.href = queryIndexUrl;
    link.textContent = queryIndexUrl;
  }

  // Compose the block table cells
  // HEADER ROW: exactly as in the example
  const headerRow = ['Search'];

  // CONTENT ROW: include all children of the search section, then the link (if present)
  const content = [];
  // Reference (not clone) all children from searchSection for resilience
  Array.from(searchSection.childNodes).forEach(node => {
    if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
      content.push(node);
    }
  });
  if (link) {
    content.push(link);
  }

  const cells = [
    headerRow,
    [content.length === 1 ? content[0] : content],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
