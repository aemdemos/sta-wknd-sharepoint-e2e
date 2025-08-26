/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Hero (hero39)'];

  // Row 2: Background image (optional)
  let imageCell = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      // Reference the image element directly
      imageCell = img;
    }
  }

  // Row 3: Content (title, subheading, CTA, etc.)
  let contentCell = null;
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // We'll use a fragment to preserve order and grouping
    const fragment = document.createDocumentFragment();
    // Title (styled heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) fragment.appendChild(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) {
      // If the description contains a single <p>, use only that <p> for cleaner markup
      if (desc.children.length === 1 && desc.firstElementChild.tagName.toLowerCase() === 'p') {
        fragment.appendChild(desc.firstElementChild);
      } else {
        fragment.appendChild(desc);
      }
    }
    // If fragment is empty, contentCell remains null
    if (fragment.childNodes.length > 0) {
      contentCell = fragment;
    }
  }

  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Use the helper to create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
