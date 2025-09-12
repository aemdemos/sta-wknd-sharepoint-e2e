/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const imgWrap = section.querySelector('.image');
    let img = null;
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Find all title elements (name, subtitle, etc)
    const titleEls = section.querySelectorAll('.title .cmp-title__text');
    let name = null;
    let subtitle = null;
    if (titleEls.length > 0) {
      name = titleEls[0];
      if (titleEls.length > 1) {
        subtitle = titleEls[1];
      }
    }

    // Find button links
    const btnBlock = section.querySelector('.buildingblock');
    let buttons = [];
    if (btnBlock) {
      const links = btnBlock.querySelectorAll('a.cmp-button');
      buttons = Array.from(links);
    }

    // Compose text cell
    const textCell = [];
    if (name) {
      const h = document.createElement('strong');
      h.textContent = name.textContent;
      textCell.push(h);
    }
    if (subtitle) {
      textCell.push(document.createElement('br'));
      const sub = document.createElement('span');
      sub.textContent = subtitle.textContent;
      textCell.push(sub);
    }
    if (buttons.length) {
      textCell.push(document.createElement('br'));
      const btnRow = document.createElement('div');
      buttons.forEach(btn => btnRow.appendChild(btn.cloneNode(true)));
      textCell.push(btnRow);
    }
    return [img ? img.cloneNode(true) : '', textCell];
  }

  // Find all contributor/guide sections
  const cards = [];
  const sections = element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
  sections.forEach(section => {
    // Defensive: skip if no image
    const imgWrap = section.querySelector('.image');
    if (!imgWrap) return;
    const img = imgWrap.querySelector('img');
    if (!img) return;
    // Defensive: skip if no name
    const nameEl = section.querySelector('.title .cmp-title__text');
    if (!nameEl) return;
    cards.push(extractCard(section));
  });

  // Compose table
  const headerRow = ['Cards (cards23)'];
  const cells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
