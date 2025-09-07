/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image__image');
    if (!img) return null;

    // Find all titles (name and role)
    const nameTitle = section.querySelector('.cmp-title h3');
    const roleTitle = section.querySelector('.cmp-title h5');

    // Find social buttons
    const buttonBlock = section.querySelector('.cmp-buildingblock--btn-list');
    let buttons = [];
    if (buttonBlock) {
      buttons = Array.from(buttonBlock.querySelectorAll('a.cmp-button'));
    }

    // Compose text cell
    const textCell = document.createElement('div');
    if (nameTitle) {
      const h3 = document.createElement('h3');
      h3.textContent = nameTitle.textContent;
      textCell.appendChild(h3);
    }
    if (roleTitle) {
      const div = document.createElement('div');
      div.textContent = roleTitle.textContent;
      textCell.appendChild(div);
    }
    if (buttons.length > 0) {
      const btnWrap = document.createElement('div');
      buttons.forEach(btn => btnWrap.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnWrap);
    }
    return [img.cloneNode(true), textCell];
  }

  // Find all contributor sections
  const sections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  const rows = [];
  sections.forEach(section => {
    const card = extractCard(section);
    if (card) rows.push(card);
  });

  // Table header
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
