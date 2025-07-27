/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // Find all list items (cards)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach(item => {
    // First cell: image
    const img = item.querySelector('img');

    // Second cell: text content (title as heading with link, then description)
    // Use existing elements where possible
    let titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let descSpan = item.querySelector('.cmp-image-list__item-description');

    // Build the text cell structure
    const textContent = document.createElement('div');
    if (titleSpan && titleLink) {
      // Heading as <h3> with link
      const h3 = document.createElement('h3');
      // Reference the existing link but replace its contents with the existing title span (as text)
      h3.appendChild(titleLink);
      textContent.appendChild(h3);
    } else if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textContent.appendChild(h3);
    }
    if (descSpan) {
      // Reference existing span as paragraph for correct semantics
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textContent.appendChild(p);
    }
    cells.push([img, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}