/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows, starting with the header
  const rows = [['Cards (cards26)']];

  // Select all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // --- Extract image element ---
    let img = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // --- Extract title (with link if present) ---
    let title = '';
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use a strong tag for visual prominence, wrap with link if present
      const strong = document.createElement('strong');
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        strong.textContent = titleSpan.textContent.trim();
      }
      // Wrap strong in anchor if link exists
      if (titleLink.getAttribute('href')) {
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href');
        a.appendChild(strong);
        title = a;
      } else {
        title = strong;
      }
    }

    // --- Extract description ---
    let description = '';
    const descriptionEl = item.querySelector('.cmp-image-list__item-description');
    if (descriptionEl) {
      description = descriptionEl.textContent.trim();
    }

    // Compose the text cell content (title in bold, then description)
    const textCell = [];
    if (title) {
      textCell.push(title);
    }
    if (title && description) {
      textCell.push(document.createElement('br'));
    }
    if (description) {
      textCell.push(document.createTextNode(description));
    }

    // Add the row for this card
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
