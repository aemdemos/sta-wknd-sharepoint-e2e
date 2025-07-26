/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list <ul> inside the passed element
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Compose the table rows
  const rows = [];
  // Header row, exactly as required
  rows.push(['Cards (cards20)']);

  // For each card/list item
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    // Get image (first cell)
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          imageCell = imageDiv;
        }
      }
    }

    // Get text content (second cell)
    const textDiv = document.createElement('div');
    // Title (strong)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textDiv.appendChild(strong);
      }
    }
    // Description (after a <br> if title is present)
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (textDiv.childNodes.length > 0) {
        textDiv.appendChild(document.createElement('br'));
      }
      textDiv.appendChild(document.createTextNode(desc.textContent.trim()));
    }

    // Add the row (both cells must be present)
    if (imageCell && textDiv.childNodes.length > 0) {
      rows.push([imageCell, textDiv]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
