/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block parsing
  // Header row as required
  const headerRow = ['Cards (cards26)'];

  // Find all card items
  const cards = [];
  // The cards are in a <ul> with class 'cmp-image-list', each <li> is a card
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      // Image: find the <img> inside the card
      let imageEl = li.querySelector('img');
      // Text content: title and description
      // Title is in <span class="cmp-image-list__item-title">, wrapped by <a>
      let titleLink = li.querySelector('a.cmp-image-list__item-title-link');
      let titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
      // Description is in <span class="cmp-image-list__item-description">
      let descSpan = li.querySelector('span.cmp-image-list__item-description');

      // Compose text cell
      const textCellContent = [];
      if (titleSpan) {
        // Use <strong> for heading style
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent;
        textCellContent.push(heading);
      }
      if (descSpan) {
        // Add description below heading
        const desc = document.createElement('div');
        desc.textContent = descSpan.textContent;
        textCellContent.push(desc);
      }
      // If the title is a link, wrap the heading in the link
      if (titleLink && titleSpan) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.appendChild(textCellContent[0]); // wrap heading
        textCellContent[0] = link;
      }

      // Card row: [image, text]
      cards.push([
        imageEl || '',
        textCellContent
      ]);
    });
  }

  // Build table rows
  const rows = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
