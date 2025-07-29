/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // First column: the image element from the card
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Use the first <img> found inside the link
      const img = imageLink.querySelector('img');
      if (img) imageEl = img;
    }

    // Second column: text (title as heading + description)
    const textContent = [];
    // Title: the text inside the .cmp-image-list__item-title, link to card
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Wrap title in <strong> and link
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        const a = document.createElement('a');
        a.href = titleLink.getAttribute('href') || '#';
        a.appendChild(strong);
        textContent.push(a);
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim() !== '') {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textContent.push(p);
    }
    rows.push([imageEl, textContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
