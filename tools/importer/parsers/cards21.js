/* global WebImporter */
export default function parse(element, { document }) {
  // Only extract card rows (2 columns: image/icon, text content)
  // Section headings and descriptions are NOT included as rows

  // Helper to extract all card sections
  function getCardSections(root) {
    return Array.from(root.querySelectorAll('section.experiencefragment'));
  }

  // Helper to extract section descriptions (italicized text)
  const sectionDescriptions = Array.from(element.querySelectorAll('.cmp-text i')).map(i => i.parentElement.cloneNode(true));

  // Helper: extract card data
  function extractCardData(cardSection, prependDescription) {
    // Image
    const img = cardSection.querySelector('img');
    // Name
    const nameEl = cardSection.querySelector('.cmp-title h3');
    // Role
    const roleEl = cardSection.querySelector('.cmp-title h5, .cmp-title--black h5');
    // Social buttons
    const buttons = Array.from(cardSection.querySelectorAll('a.cmp-button'));
    const textCell = [];
    if (prependDescription) textCell.push(prependDescription.cloneNode(true));
    if (nameEl) textCell.push(nameEl.cloneNode(true));
    if (roleEl) textCell.push(roleEl.cloneNode(true));
    if (buttons.length) {
      const btnDiv = document.createElement('div');
      btnDiv.append(...buttons.map(b => b.cloneNode(true)));
      textCell.push(btnDiv);
    }
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Compose table rows: header + only card rows
  const headerRow = ['Cards (cards21)'];
  const cardSections = getCardSections(element);
  const cardRows = [];
  // First 4 cards: Contributors
  for (let i = 0; i < 4; i++) {
    cardRows.push(extractCardData(cardSections[i], i === 0 ? sectionDescriptions[0] : null));
  }
  // Last 3 cards: Guides
  for (let i = 4; i < cardSections.length; i++) {
    cardRows.push(extractCardData(cardSections[i], i === 4 ? sectionDescriptions[1] : null));
  }

  const tableRows = [headerRow, ...cardRows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
