/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (cards)
  const imageList = element.querySelector('.image-list');
  if (!imageList) return;

  // Get all card items
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = Array.from(ul.querySelectorAll('li.cmp-image-list__item'));

  // Build the table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Image cell
    let imageEl = null;
    const img = item.querySelector('.cmp-image-list__item-image img');
    if (img) {
      imageEl = img;
    }

    // Text cell
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');

    // Compose text cell: title (as heading), description, CTA
    const textCell = [];
    if (titleSpan) {
      const h3 = document.createElement('h3');
      h3.textContent = titleSpan.textContent;
      textCell.push(h3);
    }
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textCell.push(p);
    }
    if (titleLink && titleLink.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read More';
      textCell.push(cta);
    }

    rows.push([
      imageEl,
      textCell,
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original image-list element with the block
  imageList.replaceWith(block);
}
