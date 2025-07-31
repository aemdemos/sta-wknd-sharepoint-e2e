/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row EXACTLY as in the example
  const headerRow = ['Hero (hero39)'];

  // Get the background image (optional)
  let imageElem = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) imageElem = img;
  }

  // Get the content: title, description, etc. (as a block)
  const content = element.querySelector('.cmp-teaser__content');
  let contentBlock = '';
  if (content) {
    // Put all children (title, description, etc.) into a fragment
    if (content.children && content.children.length) {
      const fragment = document.createDocumentFragment();
      Array.from(content.children).forEach(child => fragment.appendChild(child));
      contentBlock = fragment;
    } else {
      contentBlock = content;
    }
  }

  // Compose the block table as per requirements
  const rows = [
    headerRow,
    [imageElem],
    [contentBlock]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
