/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero27)'];

  // Extract image (background image in the block)
  let image = '';
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      image = img;
    }
  }

  // Extract content: Heading (h2), Description (div), CTA (a)
  const contentArr = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Heading, keep as heading element (h2)
    const heading = content.querySelector('.cmp-teaser__title');
    if (heading) {
      contentArr.push(heading);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add a line break if heading exists
      if (heading) contentArr.push(document.createElement('br'));
      contentArr.push(desc);
    }
    // CTA (call-to-action)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      // Add a line break if there is any previous content
      if (heading || desc) contentArr.push(document.createElement('br'));
      contentArr.push(cta);
    }
  }

  // Ensure empty cells are just an empty string
  const imageRow = [image || ''];
  const contentRow = [contentArr.length ? contentArr : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
