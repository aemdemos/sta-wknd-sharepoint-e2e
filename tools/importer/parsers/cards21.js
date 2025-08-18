/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match example: 'Cards (cards21)'
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];
  // 2. Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) {
    // Defensive: leave as is if not found
    return;
  }
  // 3. Each card is a <li class="cmp-image-list__item">
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image for column 1: find <img> tag in current card
    const img = li.querySelector('img');
    // Text content for column 2:
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Defensive: skip if both missing
    if (!titleSpan && !descSpan) return;
    // Use <strong> for the heading/title if present
    let fragments = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      fragments.push(strong);
    }
    if (descSpan) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      fragments.push(descDiv);
    }
    // Add the card row: [img, [title, desc]]
    cells.push([
      img,
      fragments
    ]);
  });
  // 4. Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
