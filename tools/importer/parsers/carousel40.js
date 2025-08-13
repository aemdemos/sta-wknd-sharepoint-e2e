/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Build the header row as a single cell array
  const headerRow = ['Carousel (carousel40)'];

  // 2. Build the content row - 2 columns: [image, text content]
  // Find image
  let imageElem = null;
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  if (teaserImageContainer) {
    const img = teaserImageContainer.querySelector('img');
    if (img) imageElem = img;
  }

  // Build text content block (include all relevant elements)
  const textCellContent = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // pretitle
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle);
    // title
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    // description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    // cta
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(cta);
    }
  }
  // 3. Build the full cells array
  //    First row: header (single cell)
  //    Second row: [image, text]
  const cells = [
    headerRow,
    [imageElem, textCellContent.length ? textCellContent : ''],
  ];
  // 4. Create the table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
