/* global WebImporter */
export default function parse(element, { document }) {
  // Block header (must match example exactly)
  const headerRow = ['Hero'];

  // Get the image section (optional, sometimes blank)
  let imageDiv = element.querySelector('.cmp-teaser__image');
  let imageRowContent = '';
  if (imageDiv && imageDiv.childNodes.length > 0) {
    imageRowContent = imageDiv;
  }

  // Get the content (title, description, cta, etc.)
  let contentDiv = element.querySelector('.cmp-teaser__content');
  let contentRowContent = '';
  if (contentDiv) {
    const fragment = document.createElement('div');
    // Heading
    const heading = contentDiv.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
    if (heading) {
      fragment.appendChild(heading);
    }
    // Description paragraph(s)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach((child) => {
        fragment.appendChild(child);
      });
    }
    if (fragment.childNodes.length > 0) {
      contentRowContent = fragment;
    }
  }

  // Construct the table cells as per the example (1 col, 3 rows)
  const cells = [
    headerRow,
    [imageRowContent],
    [contentRowContent],
  ];

  // Example markdown does NOT have a Section Metadata block, so don't add <hr> or metadata

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
