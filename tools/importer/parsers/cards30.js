/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards30)'];
  const cells = [headerRow];

  // Find all card items (li elements)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // ---- First column: Image ----
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        imageEl = img;
      }
    }
    
    // ---- Second column: Text content ----
    const textContent = [];
    // Title (as strong)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textContent.push(strong);
      }
    }
    // Description (if present)
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim().length > 0) {
      if (textContent.length) {
        textContent.push(document.createElement('br'));
      }
      textContent.push(desc);
    }

    // Row for this card
    cells.push([
      imageEl || '',
      textContent.length > 0 ? textContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
