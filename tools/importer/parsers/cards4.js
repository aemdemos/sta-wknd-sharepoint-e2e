/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: must match example exactly
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Locate the card list (image-list)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
      // First cell: the card image (img element)
      const image = li.querySelector('img');

      // Second cell: all text content for the card
      // Use the original <article> for maximal fidelity and resilience
      const article = li.querySelector('article');
      let textCell;
      if (article) {
        textCell = [];
        // Title: usually a link with span.title inside, up-convert to h3
        const titleLink = article.querySelector('.cmp-image-list__item-title-link');
        const titleSpan = article.querySelector('.cmp-image-list__item-title');
        if (titleSpan) {
          const h3 = document.createElement('h3');
          // If there's a title link, wrap it in the h3; else, just the text
          if (titleLink) {
            // Move the span into the link, then into h3
            if (!titleLink.contains(titleSpan)) titleLink.appendChild(titleSpan);
            h3.appendChild(titleLink);
          } else {
            h3.appendChild(titleSpan);
          }
          textCell.push(h3);
        }
        // Description: always present as .cmp-image-list__item-description
        const desc = article.querySelector('.cmp-image-list__item-description');
        if (desc && desc.textContent.trim()) {
          // Use a <p> for block semantics, text from desc
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textCell.push(p);
        }
      } else {
        // fallback: all text nodes in li
        textCell = li.textContent.trim();
      }
      cells.push([
        image || '',
        textCell
      ]);
    });
  }

  // Replace the original element with the generated table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
