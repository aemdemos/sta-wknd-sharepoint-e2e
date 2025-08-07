/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list (All Articles)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Build header row
  const rows = [['Cards (cards4)']];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // First cell: image (the .cmp-image element or img)
    let imageCell = null;
    const cmpImageDiv = li.querySelector('.cmp-image');
    if (cmpImageDiv) {
      imageCell = cmpImageDiv;
    } else {
      const img = li.querySelector('img');
      if (img) imageCell = img;
    }

    // Second cell: text content (title, description)
    const textContent = [];

    // Title (bold/strong)
    const title = li.querySelector('.cmp-image-list__item-title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.push(strong);
    }

    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (textContent.length > 0) {
        textContent.push(document.createElement('br'));
      }
      // Use a div for the description text
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textContent.push(descDiv);
    }

    // Edge-case fallback: If no title or desc found, include all text from the card
    if (textContent.length === 0) {
      // Grab visible text nodes from article
      const article = li.querySelector('.cmp-image-list__item-content');
      if (article) {
        textContent.push(document.createTextNode(article.textContent.trim()));
      }
    }

    // Add the row
    rows.push([imageCell, textContent]);
  });

  // Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
