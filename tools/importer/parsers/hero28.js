/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row (must match exactly)
  const headerRow = ['Hero (hero28)'];

  // Second row: Background image (optional)
  let imageRow = [''];
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageRow = [img]; // reference the original <img>
    }
  }

  // Third row: Block content (title, description, CTA)
  const contentArr = [];
  // Title (as heading)
  const title = element.querySelector('.cmp-teaser__title');
  if (title) {
    // Use the existing h2 as the heading (preserve semantics)
    contentArr.push(title);
  }
  // Description (as a paragraph)
  const desc = element.querySelector('.cmp-teaser__description');
  if (desc) {
    contentArr.push(desc);
  }
  // CTA link (as existing element)
  const cta = element.querySelector('.cmp-teaser__action-link');
  if (cta) {
    contentArr.push(cta);
  }
  const contentRow = [contentArr];

  // Build the table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
