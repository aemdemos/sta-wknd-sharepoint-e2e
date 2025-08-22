/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example EXACTLY
  const headerRow = ['Hero (hero6)'];

  // --- Find image ---
  let img = null;
  const teaserImgDiv = element.querySelector('[data-cmp-is="image"]');
  if (teaserImgDiv) {
    // Use the actual <img> element from the document
    img = teaserImgDiv.querySelector('img');
  }

  // --- Find title (headline) ---
  let titleEl = null;
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Accept any heading level as title
    titleEl = teaserContentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // No Section Metadata in markdown example, so none here
  // Table structure: 1 column, 3 rows; Row 1: header, Row 2: image, Row 3: title
  // All referenced elements are from the input DOM
  // Semantic meaning retained (heading, image)

  const imageRow = [img ? img : ''];
  const contentRow = [titleEl ? titleEl : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
