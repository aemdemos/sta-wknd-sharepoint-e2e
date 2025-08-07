/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero/teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!heroTeaser) return;

  // 2. Get the image element (background image)
  let imageEl = null;
  const teaserImageDiv = heroTeaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imageEl = teaserImageDiv.querySelector('img');
  }

  // 3. Get the title (Heading)
  let titleEl = null;
  const teaserContentDiv = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    titleEl = teaserContentDiv.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  }

  // Edge case: If there's no image or title, fill cell with empty string
  const imageCell = imageEl ? imageEl : '';
  const contentCell = titleEl ? titleEl : '';

  // 4. Compose the table structure
  const cells = [
    ['Hero (hero11)'], // Header row (exact)
    [imageCell],       // Image row
    [contentCell]      // Content row
  ];

  // 5. Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
