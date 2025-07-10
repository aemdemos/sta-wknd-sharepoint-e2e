/* global WebImporter */
export default function parse(element, { document }) {
  // Define the block header as in the example
  const headerRow = ['Hero (hero39)'];

  // Get background image wrapper if present
  let bgImgDiv = element.querySelector('.cmp-teaser__image');
  let bgImgCell = bgImgDiv || '';

  // Get the content cell (title and description)
  let contentDiv = element.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentDiv) {
    // Collect all children (e.g. <h2>, <div>description) as direct references
    const nodes = Array.from(contentDiv.children);
    // If only one node, return the node itself, else all
    contentCell = nodes.length === 1 ? nodes[0] : nodes;
  }

  // Compose the table rows
  const cells = [
    headerRow,
    [bgImgCell],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
