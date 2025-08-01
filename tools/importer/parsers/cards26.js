/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26)
  const cells = [ ['Cards (cards26)'] ];

  // Get all li.cmp-image-list__item
  const items = element.querySelectorAll('li.cmp-image-list__item');
  items.forEach(item => {
    // Image: the first <img> inside .cmp-image-list__item-image-link
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageEl = img;
    }
    if (!imageEl) imageEl = document.createElement('div');

    // Text content: title (linked, strong) and description (p)
    const textEls = [];
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleLink && titleSpan) {
      const strong = document.createElement('strong');
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleSpan.textContent;
      strong.appendChild(a);
      textEls.push(strong);
    }
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textEls.push(p);
    }
    // Always ensure the text cell is not empty (per requirements)
    cells.push([imageEl, textEls]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
