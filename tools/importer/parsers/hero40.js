/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero40)'];

  // Extract image (background image)
  let imgEl = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    imgEl = teaserImageDiv.querySelector('img');
  }
  const imageRow = [imgEl ? imgEl : ''];

  // Extract content (title, subheading, CTA)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (contentDiv) {
    // Featured Article (pretitle)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentCell.push(pretitle.cloneNode(true));
    // Title
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentCell.push(title.cloneNode(true));
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentCell.push(desc.cloneNode(true));
    // CTA
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentCell.push(cta.cloneNode(true));
  }
  const contentRow = [contentCell.length ? contentCell : ''];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
