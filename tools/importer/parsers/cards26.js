/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches exactly
  const rows = [['Cards (cards26)']];

  // Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
    return;
  }

  const items = Array.from(ul.querySelectorAll(':scope > li.cmp-image-list__item'));

  items.forEach((li) => {
    // Image cell: get the first <img> inside the image link
    let img = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // Text cell: strong (title) + br + description
    const textParts = [];
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const title = titleLink.querySelector('.cmp-image-list__item-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textParts.push(strong);
      }
    }
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Only add <br> if there's a title/strong already
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      textParts.push(desc);
    }
    
    // Push the row for this card
    rows.push([
      img,
      textParts.length > 1 ? textParts : (textParts[0] || '')
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
