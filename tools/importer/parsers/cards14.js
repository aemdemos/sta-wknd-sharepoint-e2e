/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exact example
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find all cards (li.cmp-image-list__item)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach(item => {
    // 1st cell: image (reference existing img element)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // 2nd cell: text content
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = null;
    if (titleLink) {
      titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    }

    // Wrap title in <strong> (matches example heading style)
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    
    // Compose text cell: Title followed by description (with <br> separator as in example)
    const textFragments = [];
    if (titleEl) textFragments.push(titleEl);
    if (descSpan) {
      // Insert <br> between title and description only if both exist
      if (titleEl) textFragments.push(document.createElement('br'));
      textFragments.push(descSpan);
    }

    // Add row: [image, textFragments]
    rows.push([
      imageEl,
      textFragments
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
