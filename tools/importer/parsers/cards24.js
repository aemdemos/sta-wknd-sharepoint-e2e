/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.image img');

    // Find all h3 and h5 titles in order
    const titles = Array.from(section.querySelectorAll('.title .cmp-title__text'));
    // Only keep h3 and h5
    const name = titles.find(el => el.tagName.toLowerCase() === 'h3');
    const subtitle = titles.find(el => el.tagName.toLowerCase() === 'h5');

    // Find all buttons
    const buttons = Array.from(section.querySelectorAll('a.cmp-button'));
    let btnDiv = null;
    if (buttons.length) {
      btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
    }

    // Compose right cell
    const rightCell = [];
    if (name) rightCell.push(name.cloneNode(true));
    if (subtitle) rightCell.push(subtitle.cloneNode(true));
    if (btnDiv) rightCell.push(btnDiv);

    return [img ? img.cloneNode(true) : '', rightCell];
  }

  // Find all contributor cards (sections)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const rows = [];
  // Table header
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // For each card section, extract info
  cardSections.forEach(section => {
    const img = section.querySelector('.image img');
    if (!img) return;
    rows.push(extractCard(section));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
