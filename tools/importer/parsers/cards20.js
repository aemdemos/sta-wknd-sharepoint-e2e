/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find all card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((li) => {
    // Get the image
    let img = null;
    const imgLink = li.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      const foundImg = imgLink.querySelector('img');
      if (foundImg) img = foundImg;
    }

    // Get the title (strong)
    let title = '';
    const titleSpan = li.querySelector('a.cmp-image-list__item-title-link span.cmp-image-list__item-title');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    }
    // Fallback: .cmp-image-list__item-title-link text
    if (!title) {
      const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
      if (titleLink) title = titleLink.textContent.trim();
    }

    // Get the description
    let desc = '';
    const descSpan = li.querySelector('span.cmp-image-list__item-description');
    if (descSpan) desc = descSpan.textContent.trim();

    // Compose the text cell
    const textCell = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textCell.push(strong);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      textCell.push(p);
    }

    // Add the row only if there is at least an image or text
    if (img || textCell.length) {
      rows.push([img, textCell]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
