/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const imageDiv = section.querySelector('.image .cmp-image');
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }

    // Find name/title (h3)
    let nameEl = section.querySelector('h3.cmp-title__text');
    // Find subtitle (h5)
    let subtitleEl = section.querySelector('h5.cmp-title__text');

    // Find all social buttons
    const buttonBlock = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
    let socialLinks = [];
    if (buttonBlock) {
      socialLinks = Array.from(buttonBlock.querySelectorAll('a.cmp-button'));
    }

    // Compose text cell
    const textCell = [];
    if (nameEl) textCell.push(nameEl.cloneNode(true));
    if (subtitleEl) textCell.push(subtitleEl.cloneNode(true));
    if (socialLinks.length) {
      const socialDiv = document.createElement('div');
      socialLinks.forEach(link => socialDiv.appendChild(link.cloneNode(true)));
      textCell.push(socialDiv);
    }

    return [imgEl ? imgEl.cloneNode(true) : '', textCell];
  }

  // Find all contributor sections (cards)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Compose table rows
  const rows = [];
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // For each card, extract info
  cardSections.forEach(section => {
    let nameEl = section.querySelector('h3.cmp-title__text');
    let subtitleEl = section.querySelector('h5.cmp-title__text');
    let nameText = nameEl ? nameEl.textContent.trim() : '';
    let subtitleText = subtitleEl ? subtitleEl.textContent.trim() : '';
    // Only add row if there is some text content
    if (!nameText && !subtitleText) return;
    rows.push(extractCard(section));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
