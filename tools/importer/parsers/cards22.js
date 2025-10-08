/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide fragment
  function extractCard(cardSection) {
    // Find image
    const img = cardSection.querySelector('.cmp-image__image');
    // Find name/title (h3)
    const name = cardSection.querySelector('h3');
    // Find subtitle/role (h5)
    const subtitle = cardSection.querySelector('h5');
    // Find social buttons (all .cmp-button inside .buildingblock)
    const btnBlock = cardSection.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }
    // Compose text cell
    const textCell = [];
    if (name) textCell.push(name.cloneNode(true));
    if (subtitle) textCell.push(subtitle.cloneNode(true));
    if (buttons.length) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCell.push(btnDiv);
    }
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment'));

  // Find section headings and descriptions
  const h2s = Array.from(element.querySelectorAll('.cmp-title h2'));
  const descs = Array.from(element.querySelectorAll('.cmp-text p'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards22)']);

  // Add section heading and description as the first row (before cards)
  if (h2s[0] || descs[0]) {
    const textCell = [];
    if (h2s[0]) textCell.push(h2s[0].cloneNode(true));
    if (descs[0]) textCell.push(descs[0].cloneNode(true));
    rows.push(['', textCell]);
  }
  // Next 4 contributor cards
  cardSections.slice(0, 4).forEach(cardSection => {
    rows.push(extractCard(cardSection));
  });

  // Add WKND Guides heading/desc as a row before guide cards
  if (h2s[1] || descs[1]) {
    const textCell = [];
    if (h2s[1]) textCell.push(h2s[1].cloneNode(true));
    if (descs[1]) textCell.push(descs[1].cloneNode(true));
    rows.push(['', textCell]);
  }
  // Next 3 guide cards
  cardSections.slice(4).forEach(cardSection => {
    rows.push(extractCard(cardSection));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
