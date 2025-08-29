/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const cells = [headerRow];

  // Find the card list
  const cardList = element.querySelector('ul.cmp-image-list');
  if (!cardList) return;
  const cardItems = cardList.querySelectorAll('li.cmp-image-list__item');

  cardItems.forEach((item) => {
    // Image extraction
    const img = item.querySelector('img');
    // Textual content extraction
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Compose text content (title as heading, then description)
    const textElements = [];
    if (titleSpan) {
      // Use strong for heading, but wrap in link if present
      let headingEl = document.createElement('strong');
      headingEl.textContent = titleSpan.textContent;
      if (titleLink && titleLink.href) {
        const linkEl = document.createElement('a');
        linkEl.href = titleLink.href;
        linkEl.append(headingEl);
        textElements.push(linkEl);
      } else {
        textElements.push(headingEl);
      }
      textElements.push(document.createElement('br'));
    }
    if (descSpan && descSpan.textContent && descSpan.textContent.trim() !== '') {
      const descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
      textElements.push(descEl);
    }
    // To keep semantic meaning, combine elements into a div for the cell
    const contentDiv = document.createElement('div');
    textElements.forEach(el => contentDiv.appendChild(el));

    // Only add the row if at least image and some text
    if (img && (titleSpan || descSpan)) {
      cells.push([img, contentDiv]);
    }
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
