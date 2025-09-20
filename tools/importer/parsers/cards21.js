/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from contributor/guide sections
  function extractCards(sections) {
    const cards = [];
    sections.forEach((section) => {
      // Defensive: find the image
      const img = section.querySelector('.image img');
      // Defensive: find the name/title
      const nameTitle = section.querySelector('.title .cmp-title__text, .title h3.cmp-title__text');
      // Defensive: find the subtitle (role)
      const subtitle = section.querySelector('.title.cmp-title--black .cmp-title__text, .title h5.cmp-title__text');
      // Defensive: find the button list
      const btnList = section.querySelector('.buildingblock');
      // Compose text cell
      const textCell = document.createElement('div');
      if (nameTitle) {
        const h3 = document.createElement('h3');
        h3.textContent = nameTitle.textContent;
        textCell.appendChild(h3);
      }
      if (subtitle) {
        const p = document.createElement('p');
        p.textContent = subtitle.textContent;
        textCell.appendChild(p);
      }
      // Add all button links as CTAs
      if (btnList) {
        const buttons = btnList.querySelectorAll('a.cmp-button');
        if (buttons.length) {
          const btnDiv = document.createElement('div');
          buttons.forEach((btn) => {
            // Clone the button to avoid moving it from the DOM
            btnDiv.appendChild(btn.cloneNode(true));
          });
          textCell.appendChild(btnDiv);
        }
      }
      // Only add if image and name/title exist
      if (img && nameTitle) {
        // Clone the image to avoid moving it
        cards.push([img.cloneNode(true), textCell]);
      }
    });
    return cards;
  }

  // Find contributor and guide sections
  const sections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  // Extract cards from all sections
  const cardRows = extractCards(sections);

  // Build table rows
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow, ...cardRows];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
