/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Defensive: Find all immediate <li> children in the image list
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Find image (mandatory)
    const imageLink = item.querySelector('a.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }
    // Defensive fallback: If no image found, skip this card
    if (!imgEl) return;

    // Find title (mandatory)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
    }
    // Defensive fallback: If no title, skip this card
    if (!titleSpan) return;

    // Find description (optional)
    const descSpan = item.querySelector('span.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    // Title as heading
    const heading = document.createElement('h3');
    heading.textContent = titleSpan.textContent;
    textCell.appendChild(heading);
    // Description below heading
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textCell.appendChild(descP);
    }
    // Call-to-action: use the title link if present
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textCell.appendChild(cta);
    }

    // Add row: [image, text]
    rows.push([imgEl, textCell]);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
