/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find the image (first .image img inside section)
    const img = section.querySelector('.image img');

    // Find the name/title (first h3 inside section)
    const nameTitle = section.querySelector('h3');

    // Find the subtitle/role (first h5 inside section)
    const subtitle = section.querySelector('h5');

    // Find the button block (all .cmp-button inside section)
    const buttonContainer = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list, .aem-Grid');
    let buttons = [];
    if (buttonContainer) {
      buttons = Array.from(buttonContainer.querySelectorAll('a.cmp-button'));
    }

    // Compose the text cell: name, subtitle, buttons
    const textCellContent = [];
    if (nameTitle) textCellContent.push(nameTitle.cloneNode(true));
    if (subtitle) textCellContent.push(subtitle.cloneNode(true));
    if (buttons.length > 0) {
      // Place all buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCellContent.push(btnDiv);
    }

    return [img ? img.cloneNode(true) : '', textCellContent];
  }

  // Find all contributor/guide cards (sections with .cmp-experience-fragment--contributor)
  const cardSections = element.querySelectorAll('section.cmp-experience-fragment--contributor');
  const rows = [];

  // Table header
  const headerRow = ['Cards (cards23)'];
  rows.push(headerRow);

  // For each card, extract row
  cardSections.forEach(section => {
    const cardRow = extractCard(section);
    // Only add if image and at least one text content exists
    if (cardRow[0] && cardRow[1].length > 0) {
      rows.push(cardRow);
    }
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
