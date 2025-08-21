/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards26)'];

  // Find the UL containing all cards
  const ul = element.querySelector('ul');
  if (!ul) return;
  const items = Array.from(ul.children).filter(li => li.classList.contains('cmp-image-list__item'));

  const rows = items.map(li => {
    // Each LI represents a card
    const article = li.querySelector('article');

    // Image cell: reference the actual <img> element
    const img = article.querySelector('.cmp-image-list__item-image img');
    const imageCell = img ? img : '';

    // Text cell: reference the actual title, link, and description elements
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleEl = '';
    if (titleLink) {
      // Use a strong element (as in example) and wrap in <a> if there is a link
      const strong = document.createElement('strong');
      // Use the title content
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        strong.textContent = titleSpan.textContent;
        // Wrap in link
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(strong);
        titleEl = link;
      } else {
        strong.textContent = '';
        titleEl = strong;
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = '';
    if (descSpan) {
      // Use a div for description for clarity (as in example)
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      descEl = descDiv;
    }

    // Compose text cell as array of elements
    const textCell = [titleEl, descEl].filter(Boolean);

    return [imageCell, textCell];
  });

  // Compose table data
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}