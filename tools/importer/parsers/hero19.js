/* global WebImporter */
export default function parse(element, { document }) {
  // 1. HEADER ROW: Block name as header
  const headerRow = ['Hero (hero19)'];

  // 2. IMAGE ROW: Background image (optional)
  let imgEl = null;
  const imageWrap = element.querySelector('.cmp-teaser__image');
  if (imageWrap) {
    // Find the FIRST img inside .cmp-teaser__image (if any)
    imgEl = imageWrap.querySelector('img');
  }

  // 3. CONTENT ROW: Title, description, CTA (if any)
  let contentEls = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title (should be present)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Subheading or description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Add all childNodes (paragraphs, text, etc.) from description
      Array.from(desc.childNodes).forEach((node) => {
        // Only insert elements or non-empty text
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())) {
          contentEls.push(node);
        }
      });
    }
  }
  // Provide empty fallback if nothing found
  if (contentEls.length === 0) contentEls = [''];

  // Assemble the rows as per requirements (header, image, content)
  const cells = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentEls]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
