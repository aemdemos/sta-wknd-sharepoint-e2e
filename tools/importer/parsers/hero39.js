/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block name exactly as given
  const headerRow = ['Hero (hero39)'];

  // 2. Second row: background image
  let imageEl = '';
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // Use <img> directly if present
    const img = imageContainer.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }
  const imageRow = [imageEl];

  // 3. Third row: headline, subheading, CTA, all text content
  const contentEls = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Use all children in order
    Array.from(content.children).forEach((child) => {
      // For title, keep original element (likely h2)
      if (child.classList.contains('cmp-teaser__title')) {
        contentEls.push(child);
      } else if (child.classList.contains('cmp-teaser__description')) {
        // If this is just a wrapper around <p>, use the <p> directly for cleaner output
        if (child.children.length === 1 && child.firstElementChild.tagName === 'P') {
          contentEls.push(child.firstElementChild);
        } else {
          // Otherwise, add the whole description block
          contentEls.push(child);
        }
      } else {
        contentEls.push(child);
      }
    });
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Compose the table rows as specified
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
