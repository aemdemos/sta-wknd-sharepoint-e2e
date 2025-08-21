/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as in the example
  const headerRow = ['Hero (hero39)'];

  // Extract the background image element (optional)
  let bgImg = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // Extract hero content: title + description (optional)
  let contentFragment = document.createDocumentFragment();
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) {
      contentFragment.appendChild(title);
    }
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      desc.childNodes.forEach((child) => {
        contentFragment.appendChild(child);
      });
    }
  }

  // Build the table: 1 column, 3 rows (header, image, content)
  const rows = [
    headerRow,
    [bgImg],
    [contentFragment]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
