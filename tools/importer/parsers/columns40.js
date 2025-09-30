/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get immediate children for robust parsing
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image img');

  // Compose left column: all content except image
  const leftColumn = [];
  if (teaserContent) {
    // Get pretitle, title, description, and CTA
    const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle) leftColumn.push(pretitle);
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) leftColumn.push(title);
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) leftColumn.push(desc);
    const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('.cmp-teaser__action-link');
      if (cta) leftColumn.push(cta);
    }
  }

  // Compose right column: image only
  const rightColumn = [];
  if (teaserImage) {
    rightColumn.push(teaserImage);
  }

  // Table structure: header row, then one row with two columns
  const headerRow = ['Columns (columns40)'];
  const contentRow = [leftColumn, rightColumn];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
