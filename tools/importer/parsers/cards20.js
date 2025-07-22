/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as per example
  const headerRow = ['Cards (cards20)'];

  // Find the image list and card items
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));

  const rows = items.map((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    // --- IMAGE CELL ---
    let imgEl = null;
    const imageLink = article && article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imgEl = img;
    }

    // --- TEXT CELL ---
    let textCell = [];
    // Title as <strong>
    const titleLink = article && article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.push(strong);
      }
    }
    // Description as <p>
    const descEl = article && article.querySelector('span.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.push(p);
    }
    // If both title and description are missing, insert a placeholder to avoid empty cell
    if (textCell.length === 0) {
      const empty = document.createElement('span');
      empty.textContent = '';
      textCell.push(empty);
    }
    return [imgEl, textCell];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
