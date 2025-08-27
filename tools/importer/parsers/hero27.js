/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as required
  const headerRow = ['Hero (hero27)'];

  // 2. Get image block (background image)
  let imageRowCell = '';
  const cmpTeaserImage = element.querySelector('.cmp-teaser__image');
  if (cmpTeaserImage) {
    // reference the image wrapper div if it exists
    const cmpImage = cmpTeaserImage.querySelector('[data-cmp-is="image"]');
    if (cmpImage) {
      imageRowCell = cmpImage;
    } else if (cmpTeaserImage.firstElementChild) {
      imageRowCell = cmpTeaserImage.firstElementChild;
    } else {
      imageRowCell = cmpTeaserImage;
    }
  }
  const imageRow = [imageRowCell];

  // 3. Get text block (title/description)
  let contentRowCell = '';
  const cmpTeaserContent = element.querySelector('.cmp-teaser__content');
  if (cmpTeaserContent) {
    // create a wrapper div and append all direct children
    const wrapper = document.createElement('div');
    // Only include direct children for resilience to HTML variations
    Array.from(cmpTeaserContent.children).forEach(child => {
      wrapper.appendChild(child);
    });
    contentRowCell = wrapper;
  }
  const contentRow = [contentRowCell];

  // 4. Compose the table (1 column, 3 rows)
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // 5. Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
