/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function getCardContent(section) {
    // Defensive: find image
    const imgContainer = section.querySelector('.image .cmp-image');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Defensive: find name/title (h3)
    let nameEl = section.querySelector('h3');
    // Defensive: find subtitle (h5)
    let subtitleEl = section.querySelector('h5');
    // Defensive: find social buttons
    let buttonsContainer = section.querySelector('.buildingblock');
    let buttons = [];
    if (buttonsContainer) {
      // Find all <a> inside .buildingblock
      buttons = Array.from(buttonsContainer.querySelectorAll('a'));
    }

    // Defensive: find description (look for .cmp-title__text, .cmp-text, or p/i under section)
    let descEl = null;
    // Try to find a description in the section
    // Sometimes description is in a <p> or <i> tag under a .cmp-text
    // But for these cards, it's usually just the subtitle
    // If there's a .cmp-text inside the section, use its content
    const textBlock = section.querySelector('.cmp-text');
    if (textBlock) {
      descEl = textBlock.cloneNode(true);
    }

    // Compose text cell: name, subtitle, description, buttons
    const textCell = [];
    if (nameEl) textCell.push(nameEl.cloneNode(true));
    if (subtitleEl) textCell.push(subtitleEl.cloneNode(true));
    if (descEl) textCell.push(descEl);
    if (buttons.length > 0) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCell.push(btnDiv);
    }
    return [imgEl ? imgEl.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    const card = getCardContent(section);
    // Only add if image and text are present
    if (card[0] && card[1].length > 0) {
      rows.push(card);
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
