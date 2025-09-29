/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.image img');
    // Find name/title (h3)
    const nameTitle = section.querySelector('h3');
    // Find subtitle (h5)
    const subtitle = section.querySelector('h5');
    // Find social buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCell = [];
    if (nameTitle) {
      const h = document.createElement('h3');
      h.textContent = nameTitle.textContent;
      textCell.push(h);
    }
    if (subtitle) {
      const p = document.createElement('p');
      p.textContent = subtitle.textContent;
      textCell.push(p);
    }
    // Add all social buttons as links (CTA)
    if (buttons.length > 0) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => {
        // Clone only the <a> tag for cleanliness
        const a = btn.cloneNode(true);
        // Remove all children except the text span
        Array.from(a.children).forEach(child => {
          if (!child.classList.contains('cmp-button__text')) {
            a.removeChild(child);
          }
        });
        btnDiv.appendChild(a);
      });
      textCell.push(btnDiv);
    }
    return [img, textCell];
  }

  // Find all contributor/guide sections
  const sections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];
  sections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Ensure all text content is included (flexible parsing)
  // If any card is missing a title or subtitle, try to find and add other direct text
  rows.slice(1).forEach(row => {
    const [img, textCell] = row;
    if (textCell.length === 0) {
      // Fallback: add all text nodes under the section
      const textNodes = Array.from(section.querySelectorAll('*'))
        .filter(el => el.childNodes.length === 1 && el.childNodes[0].nodeType === 3)
        .map(el => el.textContent.trim())
        .filter(Boolean);
      textNodes.forEach(txt => {
        const p = document.createElement('p');
        p.textContent = txt;
        textCell.push(p);
      });
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
