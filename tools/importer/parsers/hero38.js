/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block header row - must exactly match example
  const headerRow = ["Hero (hero38)"];

  // 2. Image row - use the first <img> inside .cmp-teaser__image if it exists
  let imageCell = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // 3. Content row - collect heading, subheading, description, call-to-action
  const contentCellElements = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (usually h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentCellElements.push(title);
    // Description (often div > p)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      // Push direct children (usually a <p>)
      Array.from(desc.childNodes).forEach((child) => {
        if (child.nodeType === 1) contentCellElements.push(child);
      });
    }
  }

  // Compose 1-column, 3-row table (header, image, content)
  const cells = [
    headerRow,
    [imageCell],
    [contentCellElements]
  ];

  // If no image, remove the image row to ensure correct row count
  if (!imageCell) {
    cells.splice(1, 1);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with the block
  element.replaceWith(block);
}
