/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image (img element)
  let imageEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image img');
  if (imageDiv) {
    imageEl = imageDiv.cloneNode(true);
  }

  // Find the content: title, description, CTA
  const contentDiv = document.createElement('div');
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) {
      contentDiv.appendChild(title.cloneNode(true));
    }
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      contentDiv.appendChild(desc.cloneNode(true));
    }
    // CTA
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentDiv.appendChild(cta.cloneNode(true));
    }
  }

  // Only add contentDiv if it has children
  const contentCell = contentDiv.childNodes.length > 0 ? contentDiv : '';

  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell];
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
