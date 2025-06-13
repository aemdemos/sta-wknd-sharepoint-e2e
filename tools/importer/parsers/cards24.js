/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the card info from each .experiencefragment.cmp-experience-fragment--contributor section
  function extractCard(section) {
    // Image
    const img = section.querySelector('.cmp-image__image');

    // Titles
    const h3 = section.querySelector('.cmp-title h3');
    const h5 = section.querySelector('.cmp-title h5');

    // Social buttons container (will reference all anchor tags in the .buildingblock)
    const buttonBlock = section.querySelector('.buildingblock');
    const buttonLinks = buttonBlock ? Array.from(buttonBlock.querySelectorAll('a.cmp-button')) : [];

    // Compose text cell using real elements (not cloning) and preserving structure
    const textCell = document.createElement('div');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      textCell.appendChild(strong);
    }
    if (h5) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(h5);
    }
    if (buttonLinks.length > 0) {
      textCell.appendChild(document.createElement('br'));
      const linksDiv = document.createElement('div');
      buttonLinks.forEach(btn => linksDiv.appendChild(btn));
      textCell.appendChild(linksDiv);
    }

    return [img, textCell];
  }

  // Find all contributor/guide cards (sections)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  const rows = cardSections.map(extractCard);

  // Table Header
  const headerRow = ['Cards (cards24)'];
  
  // Compose table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
