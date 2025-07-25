/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name EXACTLY as given in the example
  const headerRow = ['Hero (hero39)'];

  // Extract background image (optional)
  // Find .cmp-teaser__image > [data-cmp-is=image] > img
  let imageElem = null;
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    const cmpImageDiv = teaserImage.querySelector('[data-cmp-is="image"]');
    if (cmpImageDiv) {
      // Reference the existing img element directly
      imageElem = cmpImageDiv.querySelector('img');
    }
  }
  // If no image, leave cell blank
  const imageRow = [imageElem ? imageElem : ''];

  // Extract content elements: title, description, etc (all within .cmp-teaser__content)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  // If no content, leave cell blank
  const contentRow = [contentDiv ? contentDiv : ''];

  // Compose the block table: 1 column, 3 rows
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
