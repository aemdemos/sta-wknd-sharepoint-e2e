/* global WebImporter */
export default function parse(element, { document }) {
  // Find the relevant image-list container
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  const cells = [['Cards (cards4)']];
  // For each card
  imageList.querySelectorAll('.cmp-image-list__item').forEach((item) => {
    // Get image
    const img = item.querySelector('img');

    // Compose the text cell
    const textContent = [];
    // Title (in a link with span)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('strong');
        heading.textContent = titleSpan.textContent.trim();
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      if (textContent.length > 0) textContent.push(document.createElement('br'));
      textContent.push(document.createTextNode(descSpan.textContent.trim()));
    }

    // Edge case: if no title or description found, use all text
    if (textContent.length === 0) {
      const article = item.querySelector('article');
      if (article) {
        textContent.push(document.createTextNode(article.textContent.trim()));
      } else {
        textContent.push(document.createTextNode(item.textContent.trim()));
      }
    }

    cells.push([img, textContent]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
