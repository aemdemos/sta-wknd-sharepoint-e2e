/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find image
    const img = section.querySelector('.image img');
    // Defensive: find all titles (name, role)
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    let name = '', role = '';
    if (titleEls.length > 0) name = titleEls[0];
    if (titleEls.length > 1) role = titleEls[1];
    // Defensive: find social buttons
    const btnBlock = section.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }
    // Compose text cell: name (h3), role (h5), buttons (if any)
    const textCell = [];
    if (name) textCell.push(name);
    if (role) textCell.push(role);
    // Add description if present (sometimes present as a third title)
    if (titleEls.length > 2) {
      textCell.push(titleEls[2]);
    }
    // Add social buttons (if any)
    if (buttons.length) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn));
      textCell.push(btnDiv);
    }
    return [img, textCell];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const headerRow = ['Cards (cards6)'];
  const rows = [headerRow];
  cardSections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
