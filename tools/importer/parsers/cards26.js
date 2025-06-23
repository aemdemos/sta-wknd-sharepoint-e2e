/* global WebImporter */
export default function parse(element, { document }) {
  // Correct header: single cell row
  const headerRow = ['Cards (cards26)'];
  const rows = [];
  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find image
    let imageEl = null;
    const imgContainer = item.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      imageEl = imgContainer.querySelector('img');
    }
    // Text content
    const textContent = [];
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textContent.push(strong);
      }
    }
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent.trim();
      textContent.push(descDiv);
    }
    // Each card row must be two cells: [image, text]
    rows.push([imageEl, textContent]);
  });
  // Table structure: first row is header (single cell), then card rows (2 cells each)
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
