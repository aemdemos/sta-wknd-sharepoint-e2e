/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (first .image .cmp-image img in the main .cmp-container)
  let heroImage = null;
  const mainContainer = element.querySelector('.cmp-container');
  if (mainContainer) {
    const firstImage = mainContainer.querySelector('.image .cmp-image img');
    if (firstImage) {
      heroImage = firstImage.cloneNode(true);
    }
  }

  // Find the main title and subheading (be less specific to capture more text)
  let title = null;
  let subheading = null;
  // Find the first h1 in the main area (not just .cmp-title)
  const titleElem = element.querySelector('h1');
  if (titleElem) {
    title = titleElem.cloneNode(true);
  }
  // Find the first h4 in the main area (not just .cmp-title)
  const subheadingElem = element.querySelector('h4');
  if (subheadingElem) {
    subheading = subheadingElem.cloneNode(true);
  }

  // Compose the text cell: title, subheading (if present)
  const textCellContent = [];
  if (title) textCellContent.push(title);
  if (subheading) textCellContent.push(subheading);

  // Table rows
  const headerRow = ['Hero (hero29)'];
  const imageRow = [heroImage ? heroImage : ''];
  const textRow = [textCellContent.length ? textCellContent : ''];

  // Create the block table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
