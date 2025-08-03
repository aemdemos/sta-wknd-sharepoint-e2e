/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list within the element
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  const rows = [['Cards (cards20)']];

  // Get all the list items (cards)
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Get the image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Reference the existing <img> element only
      const img = imageLink.querySelector('img');
      if (img) imageEl = img;
    }

    // Get the title (should be bold)
    let titleEl = null;
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a <strong> for the title
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Get the description
    let descEl = null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Use a <div> for the description, as paragraph spacing is not required
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }

    // Compose the text cell, add title (as strong) and description (as div)
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);

    rows.push([
      imageEl,
      textCell,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
