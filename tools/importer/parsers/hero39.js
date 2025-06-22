/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image (may be missing)
  let imgEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // Find the content: headline (title) and description
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentArr = [];
  if (contentDiv) {
    // Headline
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Use existing element but promote to h1 (preserve inline HTML)
      const h1 = document.createElement('h1');
      h1.innerHTML = title.innerHTML;
      contentArr.push(h1);
    }
    // Description (may be missing)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add all children (usually a <p>) to contentArr by reference
      Array.from(desc.children).forEach(child => {
        contentArr.push(child);
      });
    }
  }

  // Compose the table: 1 column, 3 rows (header, image, content)
  const cells = [
    ['Hero'],
    [imgEl ? imgEl : ''],
    [contentArr.length > 0 ? contentArr : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
