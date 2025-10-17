/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser__content and cmp-teaser__image containers
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // Extract image (left column)
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img') || imageDiv;
  }

  // Extract right column content (pretitle, title, description, CTA)
  const rightColumnEls = [];
  if (contentDiv) {
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) rightColumnEls.push(pretitle);
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) rightColumnEls.push(title);
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) rightColumnEls.push(desc);
    const actionLink = contentDiv.querySelector('.cmp-teaser__action-link');
    if (actionLink) rightColumnEls.push(actionLink);
  }

  // Table structure: header, then 1 row with 2 columns (image, content)
  const headerRow = ['Columns (columns40)'];
  const contentRow = [imageEl, rightColumnEls];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
