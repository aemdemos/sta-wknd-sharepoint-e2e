/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find all direct child contributor experiencefragment sections
  function getContributorSections(container) {
    return Array.from(container.querySelectorAll(':scope > section.experiencefragment.cmp-experience-fragment--contributor'));
  }

  // Helper: extract card data from a contributor section
  function extractCardRow(section) {
    // Image (first cell)
    const img = section.querySelector('.image img');
    
    // Name (h3)
    const nameEl = section.querySelector('.cmp-title h3');
    // Subtitle (h5, if exists)
    const subtitleEl = section.querySelector('.cmp-title h5');
    // Social links (all cmp-button inside buildingblock)
    let socials = [];
    const buildingblock = section.querySelector('.buildingblock');
    if (buildingblock) {
      socials = Array.from(buildingblock.querySelectorAll('a.cmp-button'));
    }
    // Compose right cell
    const rightCell = [];
    if (nameEl) rightCell.push(nameEl);
    if (subtitleEl) {
      // If there's a subtitle, add a <br> then the subtitle
      rightCell.push(document.createElement('br'));
      rightCell.push(subtitleEl);
    }
    if (socials.length > 0) {
      // Add a <br> and then wrap socials in a div for block display
      rightCell.push(document.createElement('br'));
      const socialsDiv = document.createElement('div');
      socials.forEach(s => socialsDiv.appendChild(s));
      rightCell.push(socialsDiv);
    }
    return [img, rightCell];
  }

  // Locate the actual content container (deepest cmp-container inside the main)
  let contentRoot = element;
  // Find first <div class="cmp-container"> which directly contains the grid
  const containers = element.querySelectorAll(':scope > div.cmp-container');
  if (containers.length > 0) {
    contentRoot = containers[0];
  }

  // Find all contributor cards (sections)
  const cardSections = getContributorSections(contentRoot);

  // If no cards found, do nothing
  if (!cardSections.length) return;

  // Build the table rows
  const cells = [['Cards (cards24)']];
  cardSections.forEach(section => {
    const row = extractCardRow(section);
    cells.push(row);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
