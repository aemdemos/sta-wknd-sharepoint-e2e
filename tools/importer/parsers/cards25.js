/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image__image');
    // Find name/title
    const name = section.querySelector('h3.cmp-title__text');
    // Find subtitle/role
    const subtitle = section.querySelector('h5.cmp-title__text');
    // Find all text blocks (for more flexibility)
    const textBlocks = section.querySelectorAll('.cmp-title__text, .cmp-text p, .cmp-text i');
    // Find social buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));

    // Compose text cell
    const textCellContent = document.createElement('div');
    // Add all text blocks (name, subtitle, etc.)
    textBlocks.forEach(tb => {
      if (tb.matches('h3')) {
        const h = document.createElement('h3');
        h.textContent = tb.textContent;
        textCellContent.appendChild(h);
      } else if (tb.matches('h5')) {
        const p = document.createElement('p');
        p.textContent = tb.textContent;
        textCellContent.appendChild(p);
      } else {
        // fallback for other text
        const p = document.createElement('p');
        p.textContent = tb.textContent;
        textCellContent.appendChild(p);
      }
    });
    // Add social buttons if present
    if (buttons.length) {
      const btnContainer = document.createElement('div');
      buttons.forEach(btn => btnContainer.appendChild(btn.cloneNode(true)));
      textCellContent.appendChild(btnContainer);
    }
    return [img ? img.cloneNode(true) : '', textCellContent.childNodes.length ? Array.from(textCellContent.childNodes) : ''];
  }

  // Get all contributor cards (sections)
  const sections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build cards for contributors and guides
  const cards = [];
  sections.forEach(section => {
    const card = extractCard(section);
    cards.push(card);
  });

  // Table header
  const headerRow = ['Cards (cards25)'];
  const tableRows = [headerRow, ...cards];

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
