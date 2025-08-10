/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser block containing the hero content
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract the background image element (if present)
  let backgroundImage = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    backgroundImage = imageWrapper;
  }

  // Extract hero textual content (title, subheading, cta, etc.), referencing existing elements
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  let heroContent = [];
  if (contentDiv) {
    // Push all direct children (headings, paragraphs, etc.) to maintain structure
    Array.from(contentDiv.childNodes).forEach((node) => {
      // Only add non-empty nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        heroContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Wrap text nodes in a paragraph for structure
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        heroContent.push(p);
      }
    });
  }

  // Build the table cells as per the required structure: 1 column, 3 rows
  const cells = [
    ['Hero (hero11)'],
    [backgroundImage ? backgroundImage : ''],
    [heroContent.length ? heroContent : '']
  ];

  // Create and insert the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
