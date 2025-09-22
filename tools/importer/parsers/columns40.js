/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser content and image
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const imageDiv = element.querySelector('.cmp-teaser__image');

  // If neither found, do nothing
  if (!contentDiv && !imageDiv) return;

  // Compose left column: all content (pretitle, title, description, CTA)
  const leftColumnEls = [];
  if (contentDiv) {
    // Clone nodes to detach from source DOM
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) leftColumnEls.push(pretitle.cloneNode(true));
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) leftColumnEls.push(title.cloneNode(true));
    const description = contentDiv.querySelector('.cmp-teaser__description');
    if (description) leftColumnEls.push(description.cloneNode(true));
    const actionContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (actionContainer) leftColumnEls.push(actionContainer.cloneNode(true));
  }

  // Compose right column: image
  let imageEl = '';
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) imageEl = img.cloneNode(true);
  }

  // Table header
  const headerRow = ['Columns (columns40)'];
  // Table content row: left column (content), right column (image)
  const contentRow = [leftColumnEls, imageEl];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace element in DOM
  element.replaceWith(table);
}
