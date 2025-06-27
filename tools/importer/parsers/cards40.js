/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards40)'];
  const rows = [headerRow];

  // Find the main image list
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // For each card/item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: get the <img> element in the card
    const img = article.querySelector('.cmp-image-list__item-image img');
    
    // Title (as <strong>)
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    let titleElem = null;
    if (titleSpan) {
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent.trim();
    }

    // Description (as a text node)
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descElem = null;
    if (descSpan) {
      descElem = document.createTextNode(descSpan.textContent.trim());
    }

    // Build the text cell content: title and description
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) {
      if (titleElem) textCell.push(document.createElement('br'));
      textCell.push(descElem);
    }
    // If description is missing, at least ensure title appears
    if (!titleElem && !descElem) return; // skip empty cards entirely

    // Add row: [img, [title, <br>, desc]]
    rows.push([img, textCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
