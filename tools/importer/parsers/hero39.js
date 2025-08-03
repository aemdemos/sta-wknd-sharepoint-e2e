/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Hero (hero39)'];

  // 2nd row: background image (if present)
  let backgroundImg = '';
  const imageDiv = element.querySelector('.cmp-teaser__image .cmp-image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      backgroundImg = img;
    }
  }

  // 3rd row: title, description, cta (if present)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Use heading (h1/h2/h3/h4...) as main title
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);

    // Subheading not present in this HTML, but would be included here if present
    // Description (can contain paragraphs)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Use the whole element, so paragraphs/HTML formatting is preserved
      contentParts.push(desc);
    }
    // CTA not present in this HTML; would be handled here
  }

  // Always provide a cell, even if no content
  const textContentCell = contentParts.length > 0 ? contentParts : '';

  // Assemble the table
  const cells = [
    headerRow,
    [backgroundImg],
    [textContentCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
