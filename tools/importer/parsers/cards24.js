/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor cards (sections)
  const contributorSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
  if (!contributorSections.length) return;

  const rows = [['Cards (cards24)']];

  contributorSections.forEach(section => {
    // The innermost container that holds the card content
    const cardContainer = section.querySelector('.cmp-container .cmp-container .cmp-container');
    if (!cardContainer) return;

    // IMAGE - Use the actual <img> element from the card
    const img = cardContainer.querySelector('img.cmp-image__image');

    // TEXT CONTENT
    // Find all .cmp-title__text elements (typically h3 = name, h5 = subtitle, but may vary)
    // Place them in order, with <br> between if more than one
    const textContent = [];
    const titleNodes = cardContainer.querySelectorAll('.cmp-title__text');
    titleNodes.forEach((node, idx) => {
      if (idx > 0) textContent.push(document.createElement('br'));
      textContent.push(node);
    });

    // Find all social link buttons (should be <a class="cmp-button">") inside .buildingblock, fallback to cardContainer
    let buttons = [];
    const buttonBlock = cardContainer.querySelector('.buildingblock');
    if (buttonBlock) {
      buttons = Array.from(buttonBlock.querySelectorAll('a.cmp-button'));
    }
    if (!buttons.length) {
      buttons = Array.from(cardContainer.querySelectorAll('a.cmp-button'));
    }
    if (buttons.length) {
      // add two <br> before the buttons if there is any title
      if (textContent.length) {
        textContent.push(document.createElement('br'));
        textContent.push(document.createElement('br'));
      }
      // Add all buttons, separating with a space
      buttons.forEach((btn, idx) => {
        if (idx > 0) textContent.push(document.createTextNode(' '));
        textContent.push(btn);
      });
    }

    // Add this card (as a row)
    rows.push([
      img || '',
      textContent
    ]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
