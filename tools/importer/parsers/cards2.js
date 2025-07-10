/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block under 'All Articles'
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  const rows = [['Cards (cards2)']];

  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(cardItem => {
    const articleContent = cardItem.querySelector('.cmp-image-list__item-content');
    if (!articleContent) return;
    // Get the first <img> tag under the card (reference, do not clone)
    let imageEl = articleContent.querySelector('img');

    // Compose text cell: strong for title, div for description
    const textCell = document.createElement('div');
    // Title
    const titleSpan = articleContent.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.appendChild(strong);
    }
    // Description
    const descSpan = articleContent.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Add a space between title and description if both exist
      if (textCell.childNodes.length) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    }
    // If textCell is empty, fallback to all text
    if (!textCell.textContent.trim()) {
      textCell.textContent = articleContent.textContent.trim();
    }
    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
