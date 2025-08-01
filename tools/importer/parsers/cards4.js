/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (cards)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;
  
  // Table header must match example EXACTLY
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // IMAGE CELL
    let imgEl = li.querySelector('img');

    // TEXT CELL: strong heading, then description (div), all from DOM, preserving text from source
    const textContent = [];
    // Title (as <strong> per screenshot)
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textContent.push(strong);
    }
    // Description (as <div>)
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textContent.push(descDiv);
    }
    
    rows.push([
      imgEl,
      textContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
