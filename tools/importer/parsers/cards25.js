/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from card
  function extractImage(card) {
    // Find the first <img> inside the card
    const img = card.querySelector('img');
    return img || '';
  }

  // Helper to extract text content (title, description)
  function extractTextContent(card) {
    // Title: .cmp-image-list__item-title inside a link
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Use <strong> for heading style
        titleEl = document.createElement('strong');
        titleEl.textContent = span.textContent;
      }
    }
    // Description: .cmp-image-list__item-description
    const desc = card.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (desc) {
      descEl = document.createElement('div');
      descEl.textContent = desc.textContent;
    }
    // Compose content
    const content = [];
    if (titleEl) content.push(titleEl);
    if (descEl) content.push(descEl);
    return content;
  }

  // 1. Table header row
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // 2. Find all cards
  // The structure is: div > ul.cmp-image-list > li.cmp-image-list__item
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const cards = ul.querySelectorAll('li.cmp-image-list__item');
    cards.forEach((card) => {
      // Image in first cell
      const img = extractImage(card);
      // Text content in second cell
      const textContent = extractTextContent(card);
      rows.push([
        img,
        textContent.length ? textContent : '',
      ]);
    });
  }

  // 3. Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 4. Replace original element
  element.replaceWith(table);
}
