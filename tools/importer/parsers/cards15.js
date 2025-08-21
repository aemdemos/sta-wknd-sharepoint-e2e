/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards15)'];
  const cells = [headerRow];

  // Get all card items (list items)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Image extraction (reference element)
    let img = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      img = imageLink.querySelector('img');
      // Only use an <img> if it exists
    }

    // Text content: title (strong), description (paragraph)
    const textElements = [];
    // Title
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for semantic meaning
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textElements.push(strong);
      }
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim() !== '') {
      // Use <p> for semantic meaning
      const p = document.createElement('p');
      p.textContent = descSpan.textContent;
      textElements.push(p);
    }
    cells.push([img, textElements]);
  });

  // Create table using helper, replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
