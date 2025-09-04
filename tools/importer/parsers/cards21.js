/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const imageDiv = section.querySelector('.image .cmp-image');
    let img = null;
    if (imageDiv) {
      img = imageDiv.querySelector('img');
    }

    // Find name/title (h3)
    let name = section.querySelector('h3.cmp-title__text');
    // Find subtitle (h5)
    let subtitle = section.querySelector('h5.cmp-title__text');
    // Find social buttons
    const btnBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let buttons = [];
    if (btnBlock) {
      buttons = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
    }
    // Compose text cell
    const textCell = [];
    if (name) {
      textCell.push(name.cloneNode(true));
    }
    if (subtitle) {
      textCell.push(document.createElement('br'));
      textCell.push(subtitle.cloneNode(true));
    }
    if (buttons.length) {
      textCell.push(document.createElement('br'));
      buttons.forEach(btn => textCell.push(btn.cloneNode(true)));
    }
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];
  cardSections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
