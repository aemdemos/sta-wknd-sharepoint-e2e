/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image img');
    // Find name/title
    const nameTitle = section.querySelector('.cmp-title h3');
    // Find subtitle (role)
    const subtitle = section.querySelector('.cmp-title h5');
    // Find all text blocks (for description)
    const textBlocks = Array.from(section.querySelectorAll('.cmp-title h3, .cmp-title h5'));
    // Find social buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCell = document.createElement('div');
    // Add all text blocks in order
    textBlocks.forEach(block => {
      if (block.tagName === 'H3') {
        const h = document.createElement('h4');
        h.textContent = block.textContent;
        textCell.appendChild(h);
      } else if (block.tagName === 'H5') {
        const p = document.createElement('p');
        p.textContent = block.textContent;
        textCell.appendChild(p);
      }
    });
    // Add social buttons
    if (buttons.length) {
      const btnWrap = document.createElement('div');
      buttons.forEach(btn => btnWrap.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnWrap);
    }
    return [img, textCell];
  }

  // Find all contributor fragments (sections with class 'cmp-experience-fragment--contributor')
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  cardSections.forEach(section => {
    // Defensive: skip if no image
    const img = section.querySelector('.cmp-image img');
    if (!img) return;
    rows.push(extractCard(section));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
