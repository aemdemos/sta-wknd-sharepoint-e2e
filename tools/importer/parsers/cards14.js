/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // --- IMAGE CELL ---
    // Find the first <img> element inside the card
    const img = item.querySelector('img');
    // Reference the existing img element
    const imageCell = img;

    // --- TEXT CONTENT CELL ---
    // Find title and its link
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    // Find description
    const descriptionSpan = item.querySelector('.cmp-image-list__item-description');

    // Build up the text cell
    const textItems = [];
    
    // If there's a title, render as <strong> or <a><strong></strong></a> as appropriate
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink) {
        // If the title has a link, use the link
        const a = titleLink;
        a.innerHTML = ''; // Remove any existing children
        a.appendChild(strong);
        textItems.push(a);
      } else {
        textItems.push(strong);
      }
    }

    // If there's a description, render below title (no extra <br>, keep as block)
    if (descriptionSpan && descriptionSpan.textContent.trim()) {
      // Add space or line break if title present
      if (textItems.length > 0) {
        textItems.push(document.createElement('br'));
      }
      textItems.push(descriptionSpan);
    }

    // Add this card row: [image, text]
    cells.push([imageCell, textItems]);
  });

  // Create table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
