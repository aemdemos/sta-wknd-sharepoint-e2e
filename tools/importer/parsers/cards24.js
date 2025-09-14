/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find image
    const imgWrap = section.querySelector('.image .cmp-image');
    let img = null;
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Defensive: find name/title (h3)
    let name = section.querySelector('h3');
    // Defensive: find subtitle (h5)
    let subtitle = section.querySelector('h5');
    // Defensive: find social buttons
    const btnBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
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

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // For each card section, extract info
  cardSections.forEach(section => {
    const card = extractCard(section);
    // Only add if image and text are present
    if (card[0] && card[1].length) {
      rows.push(card);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
