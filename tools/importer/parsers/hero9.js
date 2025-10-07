/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser__image (background image)
  const imageDiv = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the cmp-teaser__content (text overlay)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentRowCells = [];
  if (contentDiv) {
    // Heading
    const heading = contentDiv.querySelector('h2');
    if (heading) {
      contentRowCells.push(heading.cloneNode(true));
    }
    // Subheading/description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((node) => {
        contentRowCells.push(node.cloneNode(true));
      });
    }
  }

  // Table rows
  const headerRow = ['Hero (hero9)'];
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  const contentRow = [contentRowCells];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
