/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teaser block (hero)
  const teaser = element.querySelector('.cmp-teaser');

  // Find the image element (reference, not clone)
  let imageEl = null;
  if (teaser) {
    const imgWrapper = teaser.querySelector('.cmp-teaser__image img');
    if (imgWrapper) imageEl = imgWrapper;
  }

  // Find the headline (reference, not clone)
  let headlineEl = null;
  if (teaser) {
    const headline = teaser.querySelector('.cmp-teaser__content h2');
    if (headline) headlineEl = headline;
  }

  // Compose the block table
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [headlineEl ? headlineEl : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
