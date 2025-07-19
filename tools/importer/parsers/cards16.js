/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Cards (cards16)'];

  // Get all the cards (li's under the .cmp-image-list)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const cards = Array.from(list.querySelectorAll('li.cmp-image-list__item'));

  const rows = [headerRow];

  cards.forEach(card => {
    const content = card.querySelector('.cmp-image-list__item-content');
    if (!content) return;

    // IMAGE cell: Get the <img> (reference it from the DOM)
    let imageCell = null;
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) imageCell = img;
      }
    }

    // TEXT cell: title (as <strong>), and description
    // Use a <div> to hold content
    const textCell = document.createElement('div');

    // Title as <strong> (reference the span, but wrap in <strong>, retain a link if present)
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        if (titleLink.href) {
          const a = document.createElement('a');
          a.href = titleLink.getAttribute('href');
          a.appendChild(strong);
          textCell.appendChild(a);
        } else {
          textCell.appendChild(strong);
        }
        textCell.appendChild(document.createElement('br'));
      }
    }

    // Description
    const desc = content.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent) {
      // Use a <p> for the description for semantics
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.appendChild(p);
    }

    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
