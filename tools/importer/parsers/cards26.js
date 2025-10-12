/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block parser
  // 1. Header row
  const headerRow = ['Cards (cards26)'];

  // 2. Find the card container (ul.cmp-image-list)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // 3. Gather all card items (li.cmp-image-list__item)
  const cards = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));
  if (!cards.length) return;

  // 4. Build table rows for each card
  const rows = cards.map((li) => {
    // Image: find the first <img> inside the card
    const img = li.querySelector('img');
    // Use the existing image element (do not clone)
    let imageEl = img;

    // Text content: build a div with title and description
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose text content
    const textDiv = document.createElement('div');
    if (titleSpan) {
      // Use <strong> for heading style
      let strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      // If the title is a link, wrap the strong in a link
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(strong);
        strong = link;
      }
      textDiv.appendChild(strong);
    }
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textDiv.appendChild(descP);
    }

    return [imageEl, textDiv];
  });

  // 5. Compose the table data
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
