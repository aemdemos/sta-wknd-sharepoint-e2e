/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const cardsHeader = ['Cards (cards24)'];
  const cards = [];
  if (!element || !element.querySelectorAll) return;

  // Find all contributor cards
  const cardSections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  cardSections.forEach(section => {
    // Left cell: image (reference existing element)
    const img = section.querySelector('img.cmp-image__image');
    const leftCell = img || '';

    // Right cell: collect all text content (name, role, plus social links)
    const rightCellContent = [];
    // Name/title (h3)
    const name = section.querySelector('h3.cmp-title__text');
    if (name) {
      // Use <strong> for the name to match example formatting
      const strong = document.createElement('strong');
      strong.textContent = name.textContent;
      rightCellContent.push(strong);
      rightCellContent.push(document.createElement('br'));
    }
    // Role (h5) if present
    const role = section.querySelector('h5.cmp-title__text');
    if (role) {
      // Use the heading as-is to preserve formatting (do not clone, reference directly)
      rightCellContent.push(role);
      rightCellContent.push(document.createElement('br'));
    }
    // Description: look for paragraphs or cmp-text, not in cmp-title
    const paras = Array.from(section.querySelectorAll('p'))
      .filter(p => !p.closest('.cmp-title'));
    paras.forEach((p, idx) => {
      rightCellContent.push(p);
      rightCellContent.push(document.createElement('br'));
    });
    // Social media links (all a.cmp-button)
    const buttons = section.querySelectorAll('a.cmp-button');
    if (buttons.length > 0) {
      const p = document.createElement('p');
      buttons.forEach((btn, idx) => {
        p.appendChild(btn);
        if (idx < buttons.length - 1) {
          p.appendChild(document.createTextNode(' '));
        }
      });
      rightCellContent.push(p);
    }
    // Remove trailing <br>
    while (rightCellContent.length && rightCellContent[rightCellContent.length-1].nodeName === 'BR') {
      rightCellContent.pop();
    }
    cards.push([leftCell, rightCellContent.length > 0 ? rightCellContent : '']);
  });

  if (cards.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      cardsHeader,
      ...cards
    ], document);
    element.replaceWith(table);
  }
}
