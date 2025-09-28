/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a card li
  function extractCard(li) {
    // Find image
    const img = li.querySelector('img');
    // Find all text content within the card
    const textElements = [];
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const h3 = document.createElement('h3');
      h3.textContent = titleLink.textContent.trim();
      textElements.push(h3);
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textElements.push(p);
    }
    // If there are any other text nodes inside the card, include them
    // (for flexibility)
    const article = li.querySelector('article');
    if (article) {
      // Get all direct text nodes (not inside title/desc)
      Array.from(article.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textElements.push(p);
        }
      });
    }
    return [img, textElements];
  }

  // Find the image-list block
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;
  const ul = imageList.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const lis = ul.querySelectorAll(':scope > li.cmp-image-list__item');

  // Build table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];
  lis.forEach((li) => {
    rows.push(extractCard(li));
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
