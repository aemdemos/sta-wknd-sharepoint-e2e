/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Hero (hero39)'];

  // Background image: extract existing <img> from .cmp-teaser__image
  let imageEl = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageEl = img;
  }
  const imageRow = [imageEl];

  // Content: extract title and description, preserve heading and paragraph
  let contentEl = '';
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    const frag = document.createDocumentFragment();
    // Title
    const title = contentWrapper.querySelector('h2');
    if (title) frag.appendChild(title);
    // Description (may have one or more block elements)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((node) => {
        frag.appendChild(node);
      });
    }
    // If content found, use a div to wrap it
    if (frag.childNodes.length > 0) {
      const div = document.createElement('div');
      div.appendChild(frag);
      contentEl = div;
    }
  }
  const contentRow = [contentEl];

  // Assemble the table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
