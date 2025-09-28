/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!teaser) return;

  // Find the image (background)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the title (headline)
  let titleEl = null;
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    titleEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Compose table rows as per block spec
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  // Third row: combine title, subheading, CTA (all in one cell)
  const thirdRowContents = [];
  if (titleEl) thirdRowContents.push(titleEl);
  // If subheading or CTA present, add here (none in this example)
  const thirdRow = [thirdRowContents.length ? thirdRowContents : ''];

  // Build the table: header, image, third row (text)
  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
