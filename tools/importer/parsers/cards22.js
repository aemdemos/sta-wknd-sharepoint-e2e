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
    // Defensive: find subtitle/role (h5)
    let subtitle = section.querySelector('h5');

    // Defensive: find social buttons
    const btnBlock = section.querySelector('.buildingblock');
    let socialLinks = [];
    if (btnBlock) {
      // Find all <a> inside .button
      socialLinks = Array.from(btnBlock.querySelectorAll('.button a'));
    }

    // Compose text cell: name, subtitle, social links
    const textCell = document.createElement('div');
    if (name) textCell.appendChild(name.cloneNode(true));
    if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
    if (socialLinks.length) {
      const socialDiv = document.createElement('div');
      socialLinks.forEach(link => socialDiv.appendChild(link.cloneNode(true)));
      textCell.appendChild(socialDiv);
    }

    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards22)'];
  rows.push(headerRow);
  // Card rows
  cardSections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
