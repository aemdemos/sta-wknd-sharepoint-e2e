/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract contributor cards from a section
  function extractCardsFromSection(section) {
    const cards = [];
    // Find the inner container (usually .cmp-container > .container > .cmp-container)
    const innerContainers = section.querySelectorAll('.cmp-container > .container.responsivegrid.cmp-layout-container--fixed > .cmp-container');
    if (innerContainers.length === 0) return cards;
    const inner = innerContainers[0];
    // Find image
    const imageWrap = inner.querySelector('.image .cmp-image__image');
    let imageEl = null;
    if (imageWrap) {
      imageEl = imageWrap.cloneNode(true);
    }
    // Find name/title (h3)
    let nameEl = inner.querySelector('.title h3');
    // Find subtitle/role (h5)
    let subtitleEl = inner.querySelector('.title h5');
    // Find social buttons
    const buttonLinks = Array.from(inner.querySelectorAll('.buildingblock .cmp-button'));
    // Compose right cell: name, subtitle, buttons
    const rightCell = document.createElement('div');
    if (nameEl) rightCell.appendChild(nameEl.cloneNode(true));
    if (subtitleEl) rightCell.appendChild(subtitleEl.cloneNode(true));
    if (buttonLinks.length) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttonLinks.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      rightCell.appendChild(btnDiv);
    }
    // Only add card if image and name are present
    if (imageEl && nameEl) {
      cards.push([imageEl, rightCell]);
    }
    return cards;
  }

  // Get all contributor sections (cards)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const rows = [];
  const headerRow = ['Cards (cards22)'];
  rows.push(headerRow);

  cardSections.forEach(section => {
    const cards = extractCardsFromSection(section);
    cards.forEach(cardRow => {
      rows.push(cardRow);
    });
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
