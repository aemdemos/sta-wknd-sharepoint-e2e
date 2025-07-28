/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as given
  const headerRow = ['Hero (hero39)'];

  // ----------- Background Image Row -------------
  // Find background image: assumed to be <img> inside .cmp-teaser__image
  let imageElem = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageElem = imageContainer.querySelector('img');
  }
  // Note: If no image is found, null will be used as cell, which is fine for optional BG

  // ----------- Content Row -------------
  // Find the content area
  const contentContainer = element.querySelector('.cmp-teaser__content');
  // We'll collect the elements in order: heading, description, etc.
  const contentElems = [];
  if (contentContainer) {
    // Find all direct children (for resiliency); collect in order
    Array.from(contentContainer.children).forEach((child) => {
      // If it's a heading
      if (/^H[1-6]$/i.test(child.tagName)) {
        contentElems.push(child);
      } else if (child.classList.contains('cmp-teaser__title')) {
        contentElems.push(child);
      } else if (child.classList.contains('cmp-teaser__description')) {
        // Push all children (usually <p>) of description
        Array.from(child.childNodes).forEach((descPart) => {
          // Only push elements (not text nodes, avoids extra whitespace)
          if (descPart.nodeType === Node.ELEMENT_NODE) {
            contentElems.push(descPart);
          }
        });
      }
    });
  }

  // Table rows: header, background image, content (in that order)
  const rows = [
    headerRow,
    [imageElem],
    [contentElems]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
