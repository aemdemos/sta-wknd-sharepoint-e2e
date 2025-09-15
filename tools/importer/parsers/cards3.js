/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Defensive: find image
    const imgContainer = section.querySelector('.image .cmp-image');
    let img = null;
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // Defensive: find titles
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    let name = null;
    let subtitle = null;
    if (titleEls.length > 0) {
      name = titleEls[0];
      if (titleEls.length > 1) {
        subtitle = titleEls[1];
      }
    }

    // Defensive: find social buttons
    const btnList = section.querySelector('.buildingblock.cmp-buildingblock--btn-list');
    let buttons = [];
    if (btnList) {
      // Find all <a> buttons inside
      buttons = Array.from(btnList.querySelectorAll('a.cmp-button'));
    }

    // Defensive: find description (subtitle in h5, or any additional text)
    let description = null;
    if (titleEls.length > 2) {
      description = titleEls[2];
    }

    // Compose right cell: name, subtitle, description, buttons
    const rightCell = [];
    if (name) rightCell.push(name);
    if (subtitle) rightCell.push(subtitle);
    if (description) rightCell.push(description);
    if (buttons.length > 0) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn));
      rightCell.push(btnDiv);
    }

    return [img, rightCell];
  }

  // Find all contributor card sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards3)'];
  rows.push(headerRow);

  // For each card section, extract info and add to table
  cardSections.forEach(section => {
    // Defensive: skip if no image
    const imgContainer = section.querySelector('.image .cmp-image');
    const img = imgContainer ? imgContainer.querySelector('img') : null;
    if (!img) return; // skip if no image

    // Compose card row
    const cardRow = extractCard(section);
    rows.push(cardRow);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
