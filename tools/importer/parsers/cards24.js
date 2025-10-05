/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function extractCardInfo(section) {
    // Find image
    const img = section.querySelector('img');
    // Find all titles
    const h3 = section.querySelector('h3'); // Name
    const h5 = section.querySelector('h5'); // Subtitle (role)
    // Find all buttons (social links)
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCell = document.createElement('div');
    if (h3) {
      const heading = document.createElement('strong');
      heading.textContent = h3.textContent;
      textCell.appendChild(heading);
      textCell.appendChild(document.createElement('br'));
    }
    if (h5) {
      const subtitle = document.createElement('span');
      subtitle.textContent = h5.textContent;
      textCell.appendChild(subtitle);
      textCell.appendChild(document.createElement('br'));
    }
    // Add description if present (look for a short description, e.g. in a p or span)
    // Try to find a description below the h5 or in the section
    let description = '';
    // Try to find a p or span after h5
    if (h5 && h5.parentElement) {
      let next = h5.parentElement.nextElementSibling;
      while (next) {
        if (next.tagName.toLowerCase() === 'p' || next.tagName.toLowerCase() === 'span') {
          description = next.textContent.trim();
          break;
        }
        next = next.nextElementSibling;
      }
    }
    // Or try to find a p in the section
    if (!description) {
      const p = section.querySelector('p');
      if (p) description = p.textContent.trim();
    }
    if (description) {
      const descEl = document.createElement('div');
      descEl.textContent = description;
      textCell.appendChild(descEl);
    }
    // Add social links if present
    if (buttons.length) {
      const linksDiv = document.createElement('div');
      buttons.forEach(btn => {
        linksDiv.appendChild(btn.cloneNode(true));
      });
      textCell.appendChild(linksDiv);
    }
    return [img, textCell];
  }

  // Find all contributor/guide sections
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment'));

  // Compose table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards24)'];
  rows.push(headerRow);

  // Add cards
  cardSections.forEach(section => {
    rows.push(extractCardInfo(section));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
