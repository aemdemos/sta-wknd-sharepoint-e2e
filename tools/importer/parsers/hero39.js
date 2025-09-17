/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Find the image element (background image)
  let imageEl = null;
  const imageDiv = teaser.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the content (title, description, subheading, CTA)
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  const contentFragment = document.createDocumentFragment();
  if (contentDiv) {
    // Title (h2)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentFragment.appendChild(title.cloneNode(true));
    // Description (div > p)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentFragment.appendChild(desc.cloneNode(true));
    // Subheading and CTA could be added here if present in future
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  const contentRow = [contentFragment.childNodes.length ? Array.from(contentFragment.childNodes) : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
