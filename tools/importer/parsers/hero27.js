/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - must exactly match example
  const headerRow = ['Hero (hero27)'];

  // Extract hero image (if present)
  let heroImg = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Reference the <img> itself if present
    const img = imageWrapper.querySelector('img');
    if (img) {
      heroImg = img;
    }
  }
  const imageRow = [heroImg ? heroImg : ''];

  // Extract content elements: heading, description, CTA
  const contentArr = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      contentArr.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      contentArr.push(desc);
    }
    // CTA
    const actionContainer = content.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) {
        contentArr.push(cta);
      }
    }
  }
  // If contentArr is empty, still provide a cell
  const contentRow = [contentArr.length === 1 ? contentArr[0] : (contentArr.length > 1 ? contentArr : '')];

  // Compose rows as per spec and example
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
