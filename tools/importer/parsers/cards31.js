/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards31)'];
  const tableRows = [headerRow];

  // Find all list items (cards)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  items.forEach((li) => {
    const article = li.querySelector('.cmp-image-list__item-content');
    // --- Image cell ---
    let img = null;
    const imgLink = article && article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // --- Text cell ---
    // Title: strong, linked if original was linked
    let textCell = [];
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        // If the title was linked, wrap in <a>
        if (titleLink.getAttribute('href')) {
          const link = document.createElement('a');
          link.href = titleLink.href;
          link.appendChild(strong);
          textCell.push(link);
        } else {
          textCell.push(strong);
        }
      }
    }
    // Description
    const descSpan = article && article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Place description in a <div> for block structure
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textCell.push(descDiv);
    }
    tableRows.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
