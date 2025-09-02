/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-container (which holds the hero block)
  const container = element.querySelector('.cmp-container');
  if (!container) return;

  // Find the .cmp-teaser inside the container
  const teaser = container.querySelector('.cmp-teaser');

  // Prepare variables
  let imgEl = null;
  let contentEls = [];

  if (teaser) {
    // Get the image element (first img inside .cmp-teaser__image)
    const imgWrapper = teaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }
    // Get all heading and paragraph elements within the teaser content area
    const contentArea = teaser.querySelector('.cmp-teaser__content');
    if (contentArea) {
      // Collect all direct children that are headings or paragraphs (h1-h6, p)
      contentEls = Array.from(contentArea.children).filter(el => /^H[1-6]$/.test(el.tagName) || el.tagName === 'P');
    }
  }

  // Table structure per block definition
  const headerRow = ['Hero (hero13)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
