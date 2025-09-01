/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the markdown example
  const headerRow = ['Cards (cards19)'];

  // Find the card list
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;
  const items = Array.from(imageList.querySelectorAll('li.cmp-image-list__item'));
  const rows = [headerRow];
  items.forEach(item => {
    // Get image (first img in image-link)
    let imgEl = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }

    // Title and description
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    const descSpan = item.querySelector('.cmp-image-list__item-description');

    // Build content (title as strong, description as p)
    const contentCell = [];
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      contentCell.push(strong);
    }
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      contentCell.push(p);
    }
    rows.push([
      imgEl,
      contentCell
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
