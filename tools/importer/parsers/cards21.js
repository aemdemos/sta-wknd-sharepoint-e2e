/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get the image list container
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Get each card item
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: first <img> inside the image link
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) imageEl = img;
    }

    // Title: Get the text from the <span> inside the title link
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span');
      if (titleSpan) {
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Description: <span class="cmp-image-list__item-description">
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent;
    }

    // Assemble card content for the text cell
    let textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (titleEl && descEl) textCellContent.push(document.createElement('br'));
    if (descEl) textCellContent.push(descEl);

    // If only one element, use it directly
    let textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

    // Table row is [image, text cell]
    rows.push([imageEl || '', textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
