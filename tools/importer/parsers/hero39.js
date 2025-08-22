/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must exactly match example
  const headerRow = ['Hero (hero39)'];

  // 2. Extract background image (row 2, col 1)
  // Find image wrapper
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  let imageElem = null;
  if (imageWrapper) {
    // Use the existing <img> element directly (do not clone)
    imageElem = imageWrapper.querySelector('img');
  }

  // 3. Extract content (title/description) (row 3, col 1)
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentWrapper) {
    // Title (usually an <h2>), preserve existing heading element
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentElements.push(title);
    // Description (usually a div with <p> children)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      // Push each child (preserves paragraph formatting)
      desc.childNodes.forEach(node => {
        // Only include Element nodes or meaningful text nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentElements.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          contentElements.push(document.createTextNode(node.textContent));
        }
      });
    }
  }

  // 4. Build table rows: 3 rows, 1 column each
  const cells = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentElements.length === 1 ? contentElements[0] : contentElements]
  ];

  // 5. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
