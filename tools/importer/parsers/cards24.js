/* global WebImporter */
export default function parse(element, { document }) {
  // Compose rows
  const rows = [['Cards (cards24)']];

  // Utility: Add intro rows before card groups
  function addIntroRows(introElems) {
    if (introElems.length > 0) {
      const introDiv = document.createElement('div');
      introElems.forEach(el => introDiv.appendChild(el));
      rows.push(['', introDiv]);
    }
  }

  // Find the grid containing all groups
  const grid = element.querySelector('.aem-Grid');
  // Gather all children so we can process in order
  const children = Array.from(grid.children);

  let introBuffer = [];
  children.forEach(child => {
    // Check for title or text block (intro content)
    if (child.classList.contains('title') || child.classList.contains('text')) {
      introBuffer.push(child);
    }
    // Check for card block
    else if (child.tagName === 'SECTION' && child.classList.contains('cmp-experience-fragment--contributor')) {
      // If there is buffered intro, add as a row before the card row
      addIntroRows(introBuffer);
      introBuffer = [];
      // Build the card row
      const img = child.querySelector('.image img');
      // Compose text cell: h3 (name), h5 (role), social links
      const textCell = [];
      let name = child.querySelector('.title .cmp-title__text, .title h3');
      if (name) textCell.push(name);
      let role = child.querySelector('.title h5');
      if (!role) {
        const titles = child.querySelectorAll('.title .cmp-title__text');
        if (titles.length > 1) role = titles[1];
      }
      if (role) textCell.push(role);
      const socials = child.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
      if (socials) {
        const links = Array.from(socials.querySelectorAll('a.cmp-button'));
        if (links.length) {
          const wrap = document.createElement('div');
          links.forEach(l => wrap.appendChild(l));
          textCell.push(wrap);
        }
      }
      rows.push([img, textCell]);
    }
  });
  // Append any trailing intro blocks after the last card
  addIntroRows(introBuffer);

  // Replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
