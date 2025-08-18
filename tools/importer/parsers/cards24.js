/* global WebImporter */
export default function parse(element, { document }) {
  // Find the key nodes for intro sections and cards
  // We'll treat anything under the main grid as relevant
  const mainGrid = element.querySelector(':scope > div > div.aem-Grid');
  if (!mainGrid) return;

  const rows = [['Cards (cards24)']];

  // Helper to create one card row
  function makeCardRow(img, texts) {
    return [img, texts];
  }

  // Collect all top-level children
  const children = Array.from(mainGrid.children);

  // For grouping, we'll push cards for every contributor/guide section. We'll also group
  // intro section headers and description text as separate card rows (spanning 2nd cell only, image empty)
  children.forEach(child => {
    // Section headers and section descriptions
    const h2 = child.querySelector(':scope > div.cmp-title > h2.cmp-title__text');
    if (h2) {
      // Add as a new row: image cell empty, text cell is h2
      rows.push(['', [h2]]);
      return;
    }
    // Section intro text (just after the section header)
    const cmpText = child.querySelector(':scope > div.cmp-text');
    if (cmpText) {
      rows.push(['', [cmpText]]);
      return;
    }
    // Contributor/Guide card sections
    if (child.tagName === 'SECTION' && child.classList.contains('cmp-experience-fragment--contributor')) {
      // Find image
      const img = child.querySelector('img');
      // Compose content: name (h3), role (h5), and social links (as a div of buttons)
      let texts = [];
      const nameEl = child.querySelector('h3.cmp-title__text');
      if (nameEl) texts.push(nameEl);
      const roleEl = child.querySelector('h5.cmp-title__text');
      if (roleEl) texts.push(roleEl);
      // Social links: grab all .cmp-button links as is
      const buttonGrid = child.querySelector('.buildingblock .aem-Grid');
      if (buttonGrid) {
        const socialLinks = Array.from(buttonGrid.querySelectorAll('a.cmp-button'));
        if (socialLinks.length) {
          const socialDiv = document.createElement('div');
          socialLinks.forEach(a => socialDiv.appendChild(a));
          texts.push(socialDiv);
        }
      }
      rows.push(makeCardRow(img, texts));
    }
    // Do not include <h1> About Us (not present in cards example)
  });

  // Only build table if we have more than header row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
