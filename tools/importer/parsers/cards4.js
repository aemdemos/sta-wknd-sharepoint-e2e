/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block (image list)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Header row as in the example
  const headerRow = ['Cards (cards4)'];

  // Collect card rows
  const cardItems = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  const rows = cardItems.map(cardEl => {
    // IMAGE COLUMN
    let imgEl = cardEl.querySelector('img');
    // TEXT COLUMN
    const parts = [];
    // Title (strong, in its own <p>, if present)
    const titleSpan = cardEl.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const titleP = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      titleP.appendChild(strong);
      parts.push(titleP);
    }
    // Description (in its own <p>, if present)
    const descSpan = cardEl.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent.trim();
      parts.push(descP);
    }
    // CTA (Read More link if present and not already in text)
    const titleLink = cardEl.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.href) {
      // Only add CTA if link is present
      const ctaP = document.createElement('p');
      const ctaA = document.createElement('a');
      ctaA.href = titleLink.href;
      ctaA.textContent = 'Read More';
      ctaP.appendChild(ctaA);
      parts.push(ctaP);
    }
    return [imgEl, parts];
  });
  
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
