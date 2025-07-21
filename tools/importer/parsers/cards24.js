/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant .aem-Grid containing the cards
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // We'll collect all card sections (between section titles)
  const rows = [['Cards (cards24)']];

  // The order is: contributors (4 cards), guides (3 cards), each with a description for group
  // Find all contributor card sections
  const contributorsHeader = Array.from(grid.querySelectorAll('.title')).find(
    t => t.textContent && t.textContent.trim().toLowerCase().includes('our contributors')
  );
  const contributorsDesc = contributorsHeader
    ? contributorsHeader.nextElementSibling && contributorsHeader.nextElementSibling.classList.contains('text')
      ? contributorsHeader.nextElementSibling.querySelector('.cmp-text')
      : null
    : null;
  // The cards for contributors (next 4 experiencefragment sections)
  const allSections = Array.from(grid.querySelectorAll('section.cmp-experience-fragment--contributor'));
  const contributorCards = allSections.slice(0, 4);

  // Guides header/description
  const guidesHeader = Array.from(grid.querySelectorAll('.title')).find(
    t => t.textContent && t.textContent.trim().toLowerCase().includes('guides')
  );
  const guidesDesc = guidesHeader
    ? guidesHeader.nextElementSibling && guidesHeader.nextElementSibling.classList.contains('text')
      ? guidesHeader.nextElementSibling.querySelector('.cmp-text')
      : null
    : null;
  // The cards for guides (next 3 experiencefragment sections)
  const guideCards = allSections.slice(4, 7);

  // Helper to build card row
  function cardRow(card, groupDesc) {
    // Image
    const img = card.querySelector('img.cmp-image__image');
    // Text content: name (h3), role (h5), groupDesc (for first card in group), social buttons
    const cellDiv = document.createElement('div');
    // Name
    const name = card.querySelector('h3');
    if (name) {
      cellDiv.appendChild(name);
    }
    // Role
    const role = card.querySelector('h5');
    if (role) {
      // Use <div> for role to match semantics
      const divRole = document.createElement('div');
      divRole.textContent = role.textContent;
      cellDiv.appendChild(divRole);
    }
    // Add group description, ONCE for the first card in the group
    if (groupDesc) {
      // Add all children of the .cmp-text container as direct children
      Array.from(groupDesc.childNodes).forEach(node => {
        cellDiv.appendChild(node.cloneNode(true));
      });
    }
    // Social buttons
    const btns = Array.from(card.querySelectorAll('a.cmp-button'));
    if (btns.length) {
      const btnDiv = document.createElement('div');
      btns.forEach(a => btnDiv.appendChild(a));
      cellDiv.appendChild(btnDiv);
    }
    return [img, cellDiv];
  }

  // Add contributor cards rows
  contributorCards.forEach((card, idx) => {
    // Add groupDesc to the first card only
    rows.push(cardRow(card, idx === 0 ? contributorsDesc : null));
  });
  // Add guides cards rows
  guideCards.forEach((card, idx) => {
    rows.push(cardRow(card, idx === 0 ? guidesDesc : null));
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
