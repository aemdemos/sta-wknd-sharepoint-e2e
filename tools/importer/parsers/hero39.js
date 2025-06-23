/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image element if present
  let imgEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Extract the content: title and description
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentFragments = [];
  if (contentDiv) {
    // Title (usually h2)
    const title = contentDiv.querySelector('h2, h1, h3, h4, h5, h6');
    if (title) contentFragments.push(title);
    // Description(s)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      Array.from(desc.childNodes).forEach(node => {
        if (
          node.nodeType === Node.ELEMENT_NODE ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
        ) {
          contentFragments.push(node);
        }
      });
    }
  }

  // Build the table according to the block spec: 1 column, 3 rows, header row = 'Hero'
  const rows = [
    ['Hero'],
    [imgEl || ''],
    [contentFragments.length > 0 ? contentFragments : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
