/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const cells = [headerRow];

  // Find all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll('li.cmp-image-list__item');
    items.forEach((li) => {
      const article = li.querySelector('article.cmp-image-list__item-content');
      if (!article) return;

      // Image (first cell)
      let imgEl = null;
      const imgLink = article.querySelector('.cmp-image-list__item-image-link');
      if (imgLink) {
        // Find the <img> inside the link
        const img = imgLink.querySelector('img');
        if (img) {
          imgEl = img;
        } else {
          // fallback: use the div[data-cmp-is=image] if present
          const imgDiv = imgLink.querySelector('div[data-cmp-is="image"]');
          if (imgDiv) imgEl = imgDiv;
        }
      }
      
      // Text (second cell)
      const textCell = [];
      // Title (as <strong> for heading)
      const titleLink = article.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) {
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent;
          textCell.push(strong);
        }
      }
      // Description
      const desc = article.querySelector('.cmp-image-list__item-description');
      if (desc) {
        // Add a <br> if there is a title above
        if (textCell.length > 0) {
          textCell.push(document.createElement('br'));
        }
        textCell.push(desc);
      }
      cells.push([
        imgEl,
        textCell
      ]);
    });
  }

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
