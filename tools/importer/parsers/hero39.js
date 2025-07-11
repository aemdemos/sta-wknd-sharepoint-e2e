/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as specified
  const headerRow = ['Hero (hero39)'];

  // 2. Extract background image (as <img> element reference) if available
  let backgroundImage = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    backgroundImage = imageDiv.querySelector('img');
  }
  // If no image found, will be null (edge case handled)

  // 3. Extract content (title, description, and any subheading or CTA if present)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Title (typically <h2>)
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // Description (may be a div with <p>)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // include all direct child nodes (could be text or elements)
      Array.from(desc.childNodes).forEach((node) => {
        // Only append meaningful nodes
        if (
          (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) ||
          (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        ) {
          contentParts.push(node);
        }
      });
    }
  }

  // 4. Build the block table: 1 column, 3 rows: [header], [image], [content]
  const cells = [
    headerRow,
    [backgroundImage], // if null, that's OK
    [contentParts],
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
