/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-container block which contains the hero teaser
  const container = element.querySelector('.cmp-container');
  if (!container) return;
  
  // Find the hero teaser block
  const heroTeaser = container.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // --- Extract background image (as-is, do not clone) ---
  let bgImg = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    const imgElem = imageWrapper.querySelector('img');
    if (imgElem) {
      bgImg = imgElem;
    }
  }

  // --- Extract headline (title) ---
  let contentCell = [];
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Hero headline (usually h1, h2, or h3)
    const headline = teaserContent.querySelector('h1, h2, h3');
    if (headline) contentCell.push(headline);
  }

  // If no headline found, push null (empty cell)
  if (contentCell.length === 0) contentCell = [''];

  // Build table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [bgImg || ''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
