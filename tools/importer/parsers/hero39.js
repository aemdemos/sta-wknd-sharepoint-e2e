/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Hero (hero39)'];

  // Find the background image (optional)
  let imageElem = null;
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    // Use the actual <img> element for referencing
    imageElem = teaserImage.querySelector('img');
  }

  // Prepare content cell: title and description
  const contentFragment = document.createDocumentFragment();
  const contentElem = element.querySelector('.cmp-teaser__content');
  if (contentElem) {
    // Title: h2
    const titleElem = contentElem.querySelector('.cmp-teaser__title');
    if (titleElem) {
      contentFragment.appendChild(titleElem);
    }
    // Description: .cmp-teaser__description (usually a <div> with <p> inside)
    const descElem = contentElem.querySelector('.cmp-teaser__description');
    if (descElem) {
      // preserve paragraphs and any content inside
      Array.from(descElem.childNodes).forEach((child) => {
        contentFragment.appendChild(child);
      });
    }
  }

  // Build the table rows: Header, Image (row 2), Content (row 3)
  const rows = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentFragment]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
