/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image (first .image img inside section)
    const imgDiv = section.querySelector('.image');
    let img = null;
    if (imgDiv) {
      img = imgDiv.querySelector('img');
    }

    // Find name (first h3)
    let name = section.querySelector('h3');
    // Find role (first h5)
    let role = section.querySelector('h5');

    // Social buttons (all .cmp-button inside section)
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    let socialDiv = null;
    if (buttons.length) {
      socialDiv = document.createElement('div');
      buttons.forEach(btn => socialDiv.appendChild(btn.cloneNode(true)));
    }

    // Compose text cell: name, role, social
    const textCell = [];
    if (name) textCell.push(name.cloneNode(true));
    if (role) textCell.push(role.cloneNode(true));
    if (socialDiv) textCell.push(socialDiv);

    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    const card = extractCard(section);
    // Only add if image and text content exist
    if (card[0] && card[1].length) {
      rows.push(card);
    }
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
