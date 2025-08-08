/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with the exact block name
  const headerRow = ['Cards (cards24)'];
  const cards = [];
  // Select all cards (contributors and guides)
  const cardSections = Array.from(element.querySelectorAll('.cmp-experiencefragment--contributor'));
  if (cardSections.length === 0) return;
  cardSections.forEach(section => {
    // IMAGE: first image in the card
    const img = section.querySelector('.cmp-image__image');
    // TEXTUAL: name, subtitle, description, and buttons (if present)
    const textContent = [];
    // Name (h3)
    const h3 = section.querySelector('h3.cmp-title__text');
    if (h3) {
      const strong = document.createElement('strong');
      strong.textContent = h3.textContent;
      textContent.push(strong);
    }
    // Subtitle (h5)
    const h5 = section.querySelector('h5.cmp-title__text');
    if (h5) {
      // Add <br> if name present
      if (h3) textContent.push(document.createElement('br'));
      textContent.push(h5);
    }
    // There is no longer/biography description per contributor in this HTML, so we do not add a p here
    // Buttons (social)
    const btnContainer = section.querySelector('.cmp-buildingblock--btn-list .aem-Grid');
    if (btnContainer) {
      const buttons = Array.from(btnContainer.querySelectorAll('a.cmp-button'));
      if (buttons.length) {
        if (textContent.length) textContent.push(document.createElement('br'));
        const btnDiv = document.createElement('div');
        buttons.forEach((btn, idx) => {
          btnDiv.appendChild(btn);
          if (idx < buttons.length - 1) btnDiv.appendChild(document.createTextNode(' '));
        });
        textContent.push(btnDiv);
      }
    }
    // Defensive: if everything is missing
    if (textContent.length === 0) {
      textContent.push('');
    }
    // Each card row is an array of 2 cells: image, text. But the table expects each row as a single array/cell: [img, text]
    cards.push([img, textContent]);
  });
  // The table expects: header row as [block name], each card as [img, text] = 2 columns
  const rows = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
