/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards21)'];

  // Find the UL holding all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Find all direct card items (LI)
  const cards = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));
  const rows = cards.map(card => {
    // Find image element
    const img = card.querySelector('.cmp-image__image');
    // Find title
    const titleSpan = card.querySelector('.cmp-image-list__item-title');
    // Find description
    const descSpan = card.querySelector('.cmp-image-list__item-description');

    // Compose text cell
    const textCell = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      // Separate with line break if both title and description
      if (titleSpan && titleSpan.textContent.trim()) textCell.push(document.createElement('br'));
      textCell.push(descSpan);
    }
    if (textCell.length === 0) {
      textCell.push('');
    }

    return [img, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
