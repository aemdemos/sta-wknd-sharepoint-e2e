/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block for the cards
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;
  // Prepare rows: header first
  const rows = [['Cards (cards4)']];
  // Get all cards (li elements)
  const items = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  items.forEach(item => {
    const article = item.querySelector('.cmp-image-list__item-content');
    // Image (first cell)
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageEl = img;
    }
    // Text (second cell)
    const textContent = document.createElement('div');
    // Title: strong
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textContent.appendChild(strong);
        textContent.appendChild(document.createElement('br'));
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descText = desc.textContent.trim();
      if (descText) {
        const descSpan = document.createElement('span');
        descSpan.textContent = descText;
        textContent.appendChild(descSpan);
      }
    }
    rows.push([imageEl, textContent]);
  });
  // Replace the original element with the cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
