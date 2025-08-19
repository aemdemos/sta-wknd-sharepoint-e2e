/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header - must match exactly
  const headerRow = ['Accordion (accordion29)'];

  // Helper for combining nodes into a container
  function combineNodes(nodes) {
    const filtered = nodes.filter(n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim()));
    if (filtered.length === 0) return '';
    if (filtered.length === 1) return filtered[0];
    const div = document.createElement('div');
    filtered.forEach(node => div.appendChild(node));
    return div;
  }

  // Split accordion items by top-level <p> elements
  const children = Array.from(element.childNodes);
  const indices = [];
  children.forEach((node, idx) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
      indices.push(idx);
    }
  });

  const rows = [];
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i];
    const end = (i + 1 < indices.length) ? indices[i + 1] : children.length;
    const title = children[start];
    const contentNodes = children.slice(start + 1, end);
    const content = combineNodes(contentNodes);
    rows.push([title, content]);
  }

  // Fallback: if no <p> found, treat everything as a single content row
  if (rows.length === 0 && children.length > 0) {
    rows.push(['', combineNodes(children)]);
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
