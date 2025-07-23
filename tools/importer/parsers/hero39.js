/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match spec
  const headerRow = ['Hero (hero39)'];

  // Get the hero background image (may not exist)
  let imageEl = null;
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    // Find first <img> inside this container
    imageEl = imgContainer.querySelector('img');
  }

  // Get the content: title and description, in order, as elements
  let contentEls = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (e.g., h2)
    const titleEl = contentContainer.querySelector('.cmp-teaser__title');
    if (titleEl) contentEls.push(titleEl);
    // Description (may contain paragraphs)
    const descContainer = contentContainer.querySelector('.cmp-teaser__description');
    if (descContainer) {
      // Add all element children (typically a single <p>) in order
      [...descContainer.childNodes].forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          contentEls.push(node);
        }
      });
    }
  }

  // Build the rows: header, image, content
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  // Create table using provided util
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element with the block table
  element.replaceWith(table);
}
