/* global WebImporter */
export default function parse(element, { document }) {
  // Block name as header - must match exactly
  const headerRow = ['Hero (hero25)'];

  // Find the hero block (the cmp-teaser--hero block)
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .teaser.cmp-teaser--hero');

  // Extract the image (if present)
  let imgEl = null;
  if (heroTeaser) {
    const teaserImageDiv = heroTeaser.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      const img = teaserImageDiv.querySelector('img');
      if (img) imgEl = img;
    }
  }

  // Extract the heading (if present)
  let headingEl = null;
  if (heroTeaser) {
    const contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Accept any heading level, use as-is
      headingEl = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Table creation: 1 column, 3 rows
  const rows = [headerRow];
  // Second row: image (may be null)
  rows.push([imgEl ? imgEl : '']);
  // Third row: heading (may be null)
  rows.push([headingEl ? headingEl : '']);

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
