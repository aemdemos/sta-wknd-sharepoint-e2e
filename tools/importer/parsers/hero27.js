/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as specified
  const headerRow = ['Hero (hero27)'];

  // Extract the background image (row 2)
  let imageEl = '';
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    // Look for a direct child div[data-cmp-is=image], then the img
    const imageCmpDiv = teaserImage.querySelector('div[data-cmp-is="image"]');
    if (imageCmpDiv) {
      const img = imageCmpDiv.querySelector('img');
      if (img) {
        imageEl = img;
      }
    }
  }

  // Extract contents for row 3 (title, subheading, paragraph etc)
  let contentCell = '';
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Reference the container as-is: it includes <h2> (title), .cmp-teaser__description (subheading/paragraph)
    contentCell = teaserContent;
  }

  // Construct table rows
  const cells = [
    headerRow,
    [imageEl],
    [contentCell],
  ];

  // Create block table & replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
