/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the content in order
  const grid = element.querySelector('.aem-Grid');
  const cells = [['Cards (cards22)']];

  // Add top-level h1 if present
  const h1 = element.querySelector('h1.cmp-title__text');
  if (h1) cells.push([h1]);

  // Gather all children in order for sequential processing
  const children = Array.from(grid.children);
  let i = 0;
  while (i < children.length) {
    const child = children[i];
    // Section header (h2 inside .cmp-title--underline)
    let sectionTitle = null;
    if (child.classList && child.classList.contains('cmp-title--underline')) {
      const h2 = child.querySelector('h2.cmp-title__text');
      if (h2) {
        sectionTitle = h2;
        cells.push([sectionTitle]);
        i++;
        // Section intro (the next .cmp-text--font-small sibling)
        if (
          i < children.length &&
          children[i].classList &&
          children[i].classList.contains('cmp-text--font-small')
        ) {
          const introDiv = children[i].querySelector('.cmp-text');
          if (introDiv) {
            cells.push([introDiv]);
          }
          i++;
        }
        // Collect card sections for this group
        while (
          i < children.length &&
          !(children[i].classList && children[i].classList.contains('cmp-title--underline'))
        ) {
          const sec = children[i];
          if (sec.tagName === 'SECTION' && sec.classList.contains('cmp-experience-fragment--contributor')) {
            // Card: extract image, name, subtitle, socials
            const img = sec.querySelector('img');
            const name = sec.querySelector('h3');
            const subtitle = sec.querySelector('h5');
            const socialBlock = sec.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
            let socials = [];
            if (socialBlock) {
              socials = Array.from(socialBlock.querySelectorAll('a.cmp-button'));
            }
            const textCell = [];
            if (name) textCell.push(name);
            if (subtitle) textCell.push(subtitle);
            if (socials.length > 0) {
              const div = document.createElement('div');
              socials.forEach(link => div.appendChild(link));
              textCell.push(div);
            }
            cells.push([img, textCell]);
          }
          i++;
        }
        continue;
      }
    }
    i++;
  }

  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
