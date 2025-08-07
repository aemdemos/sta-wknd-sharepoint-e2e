/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should exactly match spec
  const headerRow = ['Hero (hero39)'];

  // 2nd row: Background image (optional)
  let imgEl = null;
  const imgDiv = element.querySelector('.cmp-teaser__image');
  if (imgDiv) {
    imgEl = imgDiv.querySelector('img');
  }

  // 3rd row: Title, subheading, CTA (content)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentElements = [];
  if (contentDiv) {
    // Title (h2)
    const title = contentDiv.querySelector('.cmp-teaser__title,h2,h1');
    if (title) contentElements.push(title);
    // Description (paragraph(s))
    const descDiv = contentDiv.querySelector('.cmp-teaser__description');
    if (descDiv) {
      // Append all children of descDiv (could be p, text, etc.)
      Array.from(descDiv.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          contentElements.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node (rare, but possible)
          const p = document.createElement('p');
          p.textContent = node.textContent;
          contentElements.push(p);
        }
      });
    }
  }

  // Build cells array
  const cells = [
    headerRow,
    [imgEl ? imgEl : ''],
    [contentElements.length > 0 ? contentElements : '']
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}