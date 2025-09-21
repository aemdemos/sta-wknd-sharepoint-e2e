/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image, title, description, and CTA from a card li
  function extractCardData(li) {
    // Image: find the first img in the card
    const img = li.querySelector('img');
    // Text content: include all relevant text from the card
    const textCell = document.createElement('div');
    // Title
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent.trim();
      textCell.appendChild(h3);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }
    // CTA: use the title link if present
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read More';
      textCell.appendChild(cta);
    }
    return [img, textCell];
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.children).filter(li => li.classList.contains('cmp-image-list__item'));

  // Build the table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];
  cards.forEach(li => {
    rows.push(extractCardData(li));
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
