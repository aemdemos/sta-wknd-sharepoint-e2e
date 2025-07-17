/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as specified
  const headerRow = ['Carousel (carousel40)'];

  // Find image cell (first column)
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Build text cell (second column)
  const textCellContent = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textCellContent.push(pretitle);
    // Title (use existing heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) textCellContent.push(title);
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) textCellContent.push(desc);
    // CTA
    const action = content.querySelector('.cmp-teaser__action-container');
    if (action) {
      // Append all links
      action.querySelectorAll('a').forEach(link => textCellContent.push(link));
    }
  }

  // Compose the rows: header and single slide row
  const cells = [headerRow, [imageCell, textCellContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}