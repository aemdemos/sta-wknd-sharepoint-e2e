/* global WebImporter */
export default function parse(element, { document }) {
  if (!element || !document) return;

  // Block header as per spec
  const headerRow = ['Cards (cards31)'];

  // Find all card items
  const items = Array.from(element.querySelectorAll(':scope ul.cmp-image-list > li.cmp-image-list__item'));

  const rows = items.map((li) => {
    // Image: reference the actual <img> DOM node
    const img = li.querySelector('.cmp-image-list__item-image img') || document.createElement('span');

    // Title extraction
    let titleText = '';
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) titleText = titleSpan.textContent.trim();
    }

    // Description extraction
    let descText = '';
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) descText = descSpan.textContent.trim();

    // Compose text cell: heading (strong) + description
    const textCell = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.appendChild(heading);
      textCell.appendChild(document.createElement('br'));
    }
    if (descText) {
      const desc = document.createElement('span');
      desc.textContent = descText;
      textCell.appendChild(desc);
    }

    return [img, textCell];
  });

  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
