/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards30)'];
  const cards = [];

  // Get each card item
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Card image (reference existing <img> element)
    let imgEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }

    // Card text: heading (title, as link), description (paragraph)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Build text content, referencing existing elements
    const textContent = [];
    if (titleLink && titleSpan) {
      // Heading (h3) with link, using the link's actual href and title text
      const h3 = document.createElement('h3');
      const a = titleLink; // Reference existing link
      a.textContent = titleSpan.textContent;
      h3.appendChild(a);
      textContent.push(h3);
    }
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textContent.push(p);
    }

    // Push array referencing actual elements
    cards.push([
      imgEl,
      textContent
    ]);
  });

  // Build table rows: first row is header, following rows are cards
  const tableRows = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(block);
}
