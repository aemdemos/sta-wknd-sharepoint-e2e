/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser');
  let imageEl = null;
  let headingEl = null;
  if (teaser) {
    // Find the image
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
    // Find the heading/title
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Find the first heading (h1-h6)
      headingEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Compose the structure according to markdown example: Table with 1 column, 3 rows
  // Row 1: Header ("Hero" exactly)
  // Row 2: Image (or empty)
  // Row 3: Heading (or empty)
  const cells = [
    ['Hero'],
    [imageEl ? imageEl : ''],
    [headingEl ? headingEl : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
