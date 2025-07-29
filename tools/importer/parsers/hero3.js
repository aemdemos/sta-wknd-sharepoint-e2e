/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as seen in example
  const headerRow = ['Hero (hero3)'];

  // Background Image: try to extract <img> from .cmp-teaser__image (if present)
  let bgImg = '';
  const imgContainer = element.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    const img = imgContainer.querySelector('img');
    if (img) bgImg = img;
  }

  // Content: Title, description, CTA (if present)
  const contentArr = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Title (optional, usually h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);
    // Description (optional, usually div > p)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      // append all childNodes (could be text, <p>, etc) to preserve line breaks
      desc.childNodes.forEach((node) => {
        // Only add if it has text or is an element
        if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim().length > 0)) {
          contentArr.push(node);
        }
      });
    }
    // CTA: Not present in this example, but if present, include it.
    // (e.g. look for a link or button in content)
    const cta = content.querySelector('a, button');
    if (cta) contentArr.push(cta);
  }

  // Table structure: 3 rows, 1 column each
  const cells = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentArr.length ? contentArr : '']
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
