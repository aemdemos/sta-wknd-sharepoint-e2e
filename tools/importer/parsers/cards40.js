/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list block within the given element
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');

  // Compose table rows, with the header as first row
  const rows = [['Cards (cards40)']];

  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Column 1: Image (img element only)
    let image = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) image = img;
    }

    // Column 2: Title (strong) and Description (span)
    let title = '';
    let desc = '';
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        title = strong;
      }
    }
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      desc = descSpan;
    }

    // Compose cell content for text column
    let textCell;
    if (title && desc) {
      // Add <br> between title and description for structure
      const arr = [title, document.createElement('br'), desc];
      textCell = arr;
    } else if (title) {
      textCell = title;
    } else if (desc) {
      textCell = desc;
    } else {
      textCell = '';
    }

    rows.push([image || '', textCell]);
  });

  // Create the table block and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
