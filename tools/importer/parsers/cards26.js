/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];
  
  // Get the UL of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const cards = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  cards.forEach((li) => {
    // Image: from the card's image link section
    let imageCell = null;
    const imageLink = li.querySelector(':scope > article > a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }

    // Text cell: title (as heading), description (below)
    const textContent = [];
    // Title
    const titleLink = li.querySelector(':scope > article > a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const desc = li.querySelector(':scope > article > span.cmp-image-list__item-description');
    if (desc) {
      if (textContent.length > 0) {
        textContent.push(document.createElement('br'));
      }
      textContent.push(desc);
    }

    rows.push([
      imageCell,
      textContent.length === 1 ? textContent[0] : textContent // if only one, just pass the node, else array
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
