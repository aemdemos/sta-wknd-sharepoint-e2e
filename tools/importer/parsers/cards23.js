/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all contributor/guide cards
  function getCards(root) {
    const cards = [];
    const cardSections = root.querySelectorAll('section.experiencefragment');
    cardSections.forEach(section => {
      // Find image (first .cmp-image img)
      const img = section.querySelector('.cmp-image__image');
      // Find name/title (h3)
      const nameTitle = section.querySelector('h3');
      // Find subtitle (h5)
      const subtitle = section.querySelector('h5');
      // Find description (look for the nearest .cmp-title__text h3/h5, then next sibling, or use all text)
      // Try to find description from the parent container
      let description = '';
      // Try to find a paragraph or text block near the card
      const parentContainer = section.closest('.cmp-container');
      if (parentContainer) {
        // Find any .cmp-text inside parentContainer
        const textBlock = parentContainer.querySelector('.cmp-text');
        if (textBlock) {
          description = textBlock.innerHTML;
        }
      }
      // If not found, look for a .cmp-text in the main element above this section
      if (!description) {
        const prevText = section.previousElementSibling;
        if (prevText && prevText.querySelector && prevText.querySelector('.cmp-text')) {
          description = prevText.querySelector('.cmp-text').innerHTML;
        }
      }
      // Find all social buttons (all .cmp-button inside this card)
      const socialButtons = section.querySelectorAll('.cmp-button');
      let socialDiv = null;
      if (socialButtons.length > 0) {
        socialDiv = document.createElement('div');
        socialButtons.forEach(btn => socialDiv.appendChild(btn.cloneNode(true)));
      }
      // First cell: image (mandatory, reference the element)
      const imgCell = img ? img : '';
      // Second cell: text content (name, subtitle, description, social)
      const textCellContent = [];
      if (nameTitle) textCellContent.push(nameTitle.cloneNode(true));
      if (subtitle) textCellContent.push(subtitle.cloneNode(true));
      if (description) {
        const descDiv = document.createElement('div');
        descDiv.innerHTML = description;
        textCellContent.push(descDiv);
      }
      if (socialDiv) textCellContent.push(socialDiv);
      cards.push([imgCell, textCellContent]);
    });
    return cards;
  }
  // Table header
  const headerRow = ['Cards (cards23)'];
  const tableRows = [headerRow, ...getCards(element)];
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
