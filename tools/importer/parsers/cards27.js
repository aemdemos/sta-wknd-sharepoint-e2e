/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Cards (cards27)'];
  const cells = [headerRow];

  // Get all card items
  const listItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  listItems.forEach(li => {
    // Image for the card (first cell)
    const img = li.querySelector('.cmp-image-list__item-image img');
    
    // Compose text cell: heading and description
    const textContent = [];

    // Title as heading, using existing span and link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleLink && titleSpan) {
      // Use the existing link and span with strong for heading style
      const strong = document.createElement('strong');
      // Reference the titleLink, but only use its children (so no duplication of link text)
      const a = titleLink.cloneNode(false); // shallow clone to keep attributes only
      a.textContent = titleSpan.textContent;
      strong.appendChild(a);
      textContent.push(strong);
    }

    // Description, if available
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      if (textContent.length) textContent.push(document.createElement('br'));
      textContent.push(descSpan);
    }

    // Add this card row to the table
    cells.push([
      img,
      textContent
    ]);
  });

  // Create and replace with the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
