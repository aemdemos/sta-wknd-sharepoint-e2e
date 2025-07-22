/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  lis.forEach((li) => {
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // --- First cell: Image (reference the actual <img> element if present) ---
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the first <img> inside imageLink
      imageEl = imageLink.querySelector('img');
    }

    // --- Second cell: Title (strong) and Description (paragraph) ---
    // Use existing text nodes when possible
    const textElements = [];

    // Title as <strong>
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textElements.push(strong);
      }
    }

    // Description as <p>
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textElements.push(p);
    }

    // If both title and description are missing, skip this card
    if (!imageEl && textElements.length === 0) return;

    // Add row for this card
    cells.push([
      imageEl || '',
      textElements.length === 1 ? textElements[0] : textElements
    ]);
  });

  // Create and replace the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
