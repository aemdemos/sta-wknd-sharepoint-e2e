/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards21)'];
  const rows = [];
  // Defensive: Find the <ul class="cmp-image-list">
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((li) => {
      // Image: must be an <img>, reference existing element
      let imageEl = null;
      const imageLink = li.querySelector(':scope article .cmp-image-list__item-image-link');
      if (imageLink) {
        imageEl = imageLink.querySelector('img');
      }
      // Title: text in .cmp-image-list__item-title (inside a link)
      const titleLink = li.querySelector(':scope article .cmp-image-list__item-title-link');
      let titleNode = null;
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) {
          // Use <strong> for heading treatment, as shown in the reference
          const strong = document.createElement('strong');
          strong.textContent = titleSpan.textContent;
          titleNode = strong;
        }
      }
      // Description: text in .cmp-image-list__item-description
      const descSpan = li.querySelector(':scope article .cmp-image-list__item-description');
      let descNode = null;
      if (descSpan) {
        // Add as a div for separation (do not use markdown)
        const descDiv = document.createElement('div');
        descDiv.textContent = descSpan.textContent;
        descNode = descDiv;
      }
      // Compose text cell: title (strong) followed by description (if present)
      const cellContent = [];
      if (titleNode) cellContent.push(titleNode);
      if (descNode) cellContent.push(descNode);
      rows.push([imageEl, cellContent]);
    });
  }
  // Compose the final table data
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
