/* global WebImporter */
export default function parse(element, { document }) {
  // Get first .cmp-teaser--hero or .cmp-teaser block (the hero block)
  let teaser = element.querySelector('.cmp-teaser--hero');
  if (!teaser) teaser = element.querySelector('.cmp-teaser');

  // Get image (background image)
  let imageEl = null;
  if (teaser) {
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
  }

  // Get headline/title
  let headingEl = null;
  if (teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      headingEl = content.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Compose block table: 1 col x 3 rows
  // Header row is EXACTLY as in example
  const headerRow = ['Hero (hero11)'];

  // 2nd row: background image (optional)
  const imageRow = [imageEl ? imageEl : ''];

  // 3rd row: title (optional), subheading, CTA - but only title present in this example
  // Must preserve heading level and reference original element.
  const contentItems = [];
  if (headingEl) contentItems.push(headingEl);
  if (contentItems.length === 0) contentItems.push('');

  const cells = [
    headerRow,
    imageRow,
    [contentItems]
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
