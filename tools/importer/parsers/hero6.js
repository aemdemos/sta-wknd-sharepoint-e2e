/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review check:
  // - No Section Metadata table in the example, so no <hr> or metadata table.
  // - Table header is 'Hero' (no markdown or bold, just the string Hero, per example)
  // - Three rows: header, image (optional), heading (optional)
  // - Only reference existing elements. No cloning, no markdown.

  // Find the hero teaser block
  const heroEl = element.querySelector('.cmp-teaser--hero');
  if (!heroEl) return;

  // Find the background image (optional)
  let heroImg = null;
  const cmpImage = heroEl.querySelector('.cmp-image');
  if (cmpImage) heroImg = cmpImage.querySelector('img');

  // Find the heading/title (optional)
  let heroHeading = null;
  const content = heroEl.querySelector('.cmp-teaser__content');
  if (content) {
    heroHeading = content.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Build the rows as per the example: header, image row, content row
  const rows = [];
  rows.push(['Hero']);
  rows.push([heroImg ? heroImg : '']);
  rows.push([heroHeading ? heroHeading : '']);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
