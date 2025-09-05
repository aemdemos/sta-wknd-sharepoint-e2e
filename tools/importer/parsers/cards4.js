/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Table header
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // For each card (li), extract image and text content
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Defensive: find the article block
    const article = li.querySelector(':scope > article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image element inside the card
    let imageEl = null;
    const imageDiv = article.querySelector('.cmp-image-list__item-image .cmp-image');
    if (imageDiv) {
      imageEl = imageDiv.querySelector('img');
    }
    // If not found, fallback to any img inside the card
    if (!imageEl) {
      imageEl = article.querySelector('img');
    }

    // --- Text cell ---
    // Instead of picking only specific elements, include all text content in the card's article
    // This ensures we don't miss any text
    const textCellContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const h3 = document.createElement('h3');
      h3.textContent = titleLink.textContent.trim();
      textCellContent.push(h3);
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCellContent.push(p);
    }
    // CTA (if present)
    if (titleLink && titleLink.href) {
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = 'Read More';
      textCellContent.push(a);
    }
    // Defensive: If there is other text content not captured above, add it
    // For flexibility, add any direct text nodes in the article
    Array.from(article.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textCellContent.push(span);
      }
    });

    // Add the row: [image, text]
    rows.push([
      imageEl ? imageEl : '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
