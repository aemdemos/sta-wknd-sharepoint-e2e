/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];

  // Find all card items (li elements)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Get the article content directly for structure
    const article = li.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE ---
    // Use the first <img> found
    const img = article.querySelector('img');

    // --- TEXT CONTENT ---
    // Title
    let textElems = [];
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      // Use strong to match example card heading emphasis
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      // If there is a link, wrap in <a>
      let titleNode = strong;
      if (titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.appendChild(strong);
        titleNode = a;
      }
      textElems.push(titleNode);
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      // Place description in its own div for block-level separation
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textElems.push(descDiv);
    }
    // If both missing, fallback to empty cell
    if (textElems.length === 0) textElems = [''];

    // Add row: [image, text]
    cells.push([
      img || '',
      textElems
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}