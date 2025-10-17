/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract section heading and description
  function getSectionMeta(container) {
    const heading = container.querySelector('h2.cmp-title__text');
    const desc = container.querySelector('.cmp-text i, .cmp-text p i');
    const meta = [];
    if (heading) meta.push(heading.cloneNode(true));
    if (desc) meta.push(desc.cloneNode(true));
    return meta.length ? meta : null;
  }

  // Find all top-level containers for sections
  const containers = Array.from(element.querySelectorAll('div.cmp-container'));
  const frag = document.createDocumentFragment();

  containers.forEach((container) => {
    // Only process containers that contain card fragments
    const cardSections = Array.from(container.querySelectorAll('section.experiencefragment'));
    if (cardSections.length) {
      // Prepare block rows
      const rows = [];
      // Add header row
      rows.push(['Cards (cards24)']);
      // Add section heading/description as a row (not as a card)
      const meta = getSectionMeta(container);
      if (meta) rows.push([meta.join(' ')]); // single cell, not a card row
      // Add cards
      cardSections.forEach((cardSection) => {
        const img = cardSection.querySelector('img');
        const name = cardSection.querySelector('h3');
        const role = cardSection.querySelector('h5');
        const buttons = Array.from(cardSection.querySelectorAll('a.cmp-button'));
        const textCell = [];
        if (name) textCell.push(name.cloneNode(true));
        if (role) textCell.push(role.cloneNode(true));
        if (buttons.length) {
          const btnRow = document.createElement('div');
          btnRow.style.display = 'flex';
          btnRow.style.gap = '8px';
          buttons.forEach((btn) => btnRow.appendChild(btn.cloneNode(true)));
          textCell.push(btnRow);
        }
        rows.push([img ? img.cloneNode(true) : '', textCell]);
      });
      const table = WebImporter.DOMUtils.createTable(rows, document);
      frag.appendChild(table);
    }
  });

  // Replace original element
  element.replaceWith(frag);
}
