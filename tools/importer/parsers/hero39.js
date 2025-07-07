/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the example
  const headerRow = ['Hero (hero39)'];

  // Get the .cmp-teaser__image and its <img> (for background image row)
  let imgElem = null;
  const imageSection = element.querySelector('.cmp-teaser__image');
  if (imageSection) {
    imgElem = imageSection.querySelector('img');
  }

  // Get the content section (title and description)
  const contentSection = element.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (contentSection) {
    // Title
    const title = contentSection.querySelector('.cmp-teaser__title');
    if (title) contentNodes.push(title);
    // Description (may be rich HTML)
    const desc = contentSection.querySelector('.cmp-teaser__description');
    if (desc) {
      // include all its child nodes (may be <p> or other elements)
      desc.childNodes.forEach(node => {
        // Only push element nodes or non-empty text nodes
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          contentNodes.push(node);
        }
      });
    }
  }

  // Compose the table rows (always 3 rows, with img row as null if no image)
  const rows = [
    headerRow,
    [imgElem],
    [contentNodes],
  ];

  // Remove the image row if imgElem is null (to avoid empty row)
  const cells = [rows[0]];
  if (rows[1][0]) cells.push(rows[1]);
  cells.push(rows[2]);

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
