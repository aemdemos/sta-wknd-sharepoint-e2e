/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' image-list block
  let imageListBlock = null;
  const divs = element.querySelectorAll(':scope > div');
  for (const div of divs) {
    if (div.classList.contains('image-list')) {
      imageListBlock = div;
      break;
    }
  }
  if (!imageListBlock) return;
  const ul = imageListBlock.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header
  const headerRow = ['Cards (cards4)'];
  // Card rows
  const cardRows = [];
  const items = ul.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;
    // Image
    const imgLink = article.querySelector('.cmp-image-list__item-image-link img');
    // Title
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    cardRows.push([imgLink, textCell]);
  });
  if (!cardRows.length) return;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the imageListBlock with the new table
  imageListBlock.replaceWith(table);
}
