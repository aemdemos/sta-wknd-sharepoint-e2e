/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find all contributor/guide cards (sections with class 'experiencefragment')
  const cardSections = element.querySelectorAll('section.experiencefragment');

  cardSections.forEach(section => {
    // Defensive: find the innermost container with the actual card content
    let cardRoot = section;
    while (cardRoot && cardRoot.children.length === 1 && cardRoot.firstElementChild) {
      cardRoot = cardRoot.firstElementChild;
    }

    // 1. Image: find the first <img> inside .image
    let img = cardRoot.querySelector('.image img');

    // 2. Text cell: collect all content blocks for the card
    const textCellContent = [];

    // Find all .title blocks in the card
    const titleBlocks = cardRoot.querySelectorAll('.title .cmp-title');
    titleBlocks.forEach(tb => {
      // Get heading (h3 or h5)
      const h3 = tb.querySelector('h3');
      const h5 = tb.querySelector('h5');
      if (h3) {
        const strong = document.createElement('strong');
        strong.textContent = h3.textContent;
        textCellContent.push(strong);
        textCellContent.push(document.createElement('br'));
      }
      if (h5) {
        const span = document.createElement('span');
        span.textContent = h5.textContent;
        textCellContent.push(span);
        textCellContent.push(document.createElement('br'));
      }
    });

    // Find any extra description text in .cmp-title blocks without h3/h5
    titleBlocks.forEach(tb => {
      const h3 = tb.querySelector('h3');
      const h5 = tb.querySelector('h5');
      if (!h3 && !h5) {
        const desc = tb.textContent.trim();
        if (desc) {
          const descP = document.createElement('p');
          descP.textContent = desc;
          textCellContent.push(descP);
        }
      }
    });

    // Find all social buttons
    const buttonsBlock = cardRoot.querySelector('.buildingblock');
    if (buttonsBlock) {
      const buttons = Array.from(buttonsBlock.querySelectorAll('a.cmp-button'));
      if (buttons.length > 0) {
        textCellContent.push(...buttons);
      }
    }

    // Ensure all text content from the card is included
    rows.push([
      img ? img : '',
      textCellContent.length > 0 ? textCellContent : '',
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
