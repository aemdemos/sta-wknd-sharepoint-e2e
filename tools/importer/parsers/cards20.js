/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards20)']; // Must be exactly one column per guidelines
  const rows = [headerRow];

  // Find the image-list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items (should include all li elements)
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // --- IMAGE CELL ---
    // Find the image link and image inside the card
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imgCell = null;
    if (imgLink) {
      // Clone the anchor and its image
      const a = document.createElement('a');
      a.href = imgLink.href;
      const img = imgLink.querySelector('img');
      if (img) {
        a.appendChild(img.cloneNode(true));
        imgCell = a;
      }
    }

    // --- TEXT CELL ---
    // Title (as heading, wrapped in link)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    let titleCell = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.innerHTML = `<strong>${titleText}</strong>`;
        titleCell = a;
      }
    }

    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose text cell content (title link, then description)
    const textCellContent = [];
    if (titleCell) textCellContent.push(titleCell);
    if (descEl) textCellContent.push(descEl);

    // Add row: [image/link, text/link]
    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
