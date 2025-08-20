/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the inner cmp-teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // Prepare background image row
  let bgImage = '';
  if (teaser) {
    const imageDiv = teaser.querySelector('.cmp-teaser__image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) bgImage = img;
    }
  }

  // Prepare content row
  let content = [];
  if (teaser) {
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) content.push(title);
      // Description
      const descDiv = contentDiv.querySelector('.cmp-teaser__description');
      if (descDiv) {
        // Add all child nodes (preserving paragraphs, spans, etc)
        Array.from(descDiv.childNodes).forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            content.push(node);
          }
        });
      }
    }
  }
  // Fallback for empty content row
  if (content.length === 0) content = [''];

  // Build cells: 1 column, 3 rows
  const cells = [
    ['Hero (hero39)'],
    [bgImage ? bgImage : ''],
    [content]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}