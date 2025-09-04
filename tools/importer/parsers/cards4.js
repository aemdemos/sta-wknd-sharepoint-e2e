/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block for the cards
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Table header as specified
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // Each card is a <li> in the image-list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image
    let imgEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: clone the image so we don't move it from the DOM
    imgEl = imgEl ? imgEl.cloneNode(true) : '';

    // Find the title and description
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');

    // Compose text cell
    const textCell = document.createElement('div');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.appendChild(strong);
    }
    if (descSpan) {
      textCell.appendChild(document.createElement('br'));
      // Clone the description node to preserve text
      textCell.appendChild(descSpan.cloneNode(true));
    }
    // Add CTA if available (use the title link if present)
    if (titleLink && titleLink.href) {
      textCell.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read More';
      textCell.appendChild(cta);
    }

    rows.push([
      imgEl,
      textCell.childNodes.length ? Array.from(textCell.childNodes) : '',
    ]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
