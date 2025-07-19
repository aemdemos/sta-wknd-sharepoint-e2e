/* global WebImporter */
export default function parse(element, { document }) {
  // Find the list of cards (image-list)
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  
  // Table: header row as in the example
  const rows = [['Cards (cards21)']];

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return; // edge-case
    
    // IMAGE: find first <img> inside .cmp-image-list__item-image-link
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }
    // fallback: if not found, leave imageCell null
    
    // TEXT: strong title + description (as <p>)
    const textCellContent = [];
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for the heading, as in the example
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCellContent.push(strong);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCellContent.push(p);
    }
    // If either title or description missing, fallback to whatever exists
    rows.push([
      imageCell,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
