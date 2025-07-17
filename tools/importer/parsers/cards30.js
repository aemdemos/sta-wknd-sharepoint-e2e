/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards30)'];
  const tableRows = [];

  const list = element.querySelector('ul.cmp-image-list');
  if (!list) {
    // If structure is not as expected, replace with just the header
    const table = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(table);
    return;
  }

  // Each card = li.cmp-image-list__item
  const items = list.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) {
      return;
    }
    // IMAGE/CELL 1: Take the <img> element directly
    let imageCell = '';
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageContainer = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageContainer) {
        const img = imageContainer.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }

    // TEXT/CELL 2: Title (heading), Description, (CTA is redundant, skip)
    const textCell = document.createElement('div');
    let hasContent = false;

    // Title (as strong)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
        hasContent = true;
      }
    }

    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      const descSpan = document.createElement('span');
      descSpan.textContent = desc.textContent.trim();
      textCell.appendChild(descSpan);
      hasContent = true;
    }

    // If textCell is empty, fallback to blank string
    tableRows.push([
      imageCell || '',
      hasContent ? textCell : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tableRows
  ], document);
  element.replaceWith(table);
}
