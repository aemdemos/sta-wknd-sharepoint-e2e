/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must exactly match example
  const headerRow = ['Cards (cards21)'];

  // Find the UL containing the cards
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  const rows = [headerRow];
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- COLUMN 1: IMAGE ---
    // Find the first <img> (image for this card)
    let imageEl = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      // Only the <img> element, not the container div
      imageEl = imageLink.querySelector('img');
    }

    // --- COLUMN 2: TEXT CONTENT ---
    const textElems = [];
    // Title: use bold (<strong>) like the example
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textElems.push(strong);
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Add as a <div> so it appears below title, as in the example
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textElems.push(descDiv);
    }

    // No extra columns, only exactly two per row
    rows.push([imageEl, textElems]);
  });

  // Build and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
