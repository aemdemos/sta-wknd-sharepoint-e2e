/* global WebImporter */
export default function parse(element, { document }) {
  // Collect the first image in the element
  const img = element.querySelector('img');

  // Find a prominent overlay text, such as a large heading or bold text
  let overlayText = null;
  let maxLen = 0;
  element.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, span, div').forEach(node => {
    const txt = node.textContent && node.textContent.trim();
    // Only consider visible non-empty text nodes
    if (txt && txt.length > maxLen) {
      overlayText = node;
      maxLen = txt.length;
    }
  });

  // Compose the content for the cell: image, then overlay text if present
  const cellContent = [];
  if (img) cellContent.push(img);
  if (overlayText && (!img || overlayText !== img)) {
    if (img) cellContent.push(document.createElement('br'));
    cellContent.push(overlayText);
  }
  if (cellContent.length === 0) return;

  // Create a single-column, two-row table: header row and content row
  const cells = [
    ['Video'],
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
