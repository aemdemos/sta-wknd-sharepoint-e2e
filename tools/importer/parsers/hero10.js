/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser');
  let imageDiv = null;
  let backgroundImg = null;
  let contentDiv = null;
  let heading = null;

  if (teaser) {
    imageDiv = teaser.querySelector('.cmp-teaser__image');
    if (imageDiv) {
      backgroundImg = imageDiv.querySelector('img');
    }
    contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Table rows: header, background image, content (heading)
  const rows = [];
  // 1. Block Name header
  rows.push(['Hero (hero10)']);
  // 2. Background image (optional)
  rows.push([backgroundImg ? backgroundImg : '']);
  // 3. Title and other content (optional)
  // Use the referenced heading element directly if it exists, otherwise an empty string
  rows.push([heading ? heading : '']);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
