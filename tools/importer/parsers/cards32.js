/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];
  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // First column: image
    let image = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) {
        image = img; // Reference the actual img element
      }
    }

    // Second column: text content (title as heading, then description)
    // Get the link that wraps the title, if present
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let textCellNodes = [];
    if (titleLink) {
      // Reference the real <a> element, but format its inner title as <strong>
      // Replace <span> with <strong>
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        titleLink.replaceChild(strong, titleSpan);
      }
      textCellNodes.push(titleLink);
    } else {
      const titleSpan = item.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textCellNodes.push(strong);
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add line break if there is both title and description
      if (textCellNodes.length > 0) {
        textCellNodes.push(document.createElement('br'));
      }
      textCellNodes.push(desc);
    }
    rows.push([
      image,
      textCellNodes.length === 1 ? textCellNodes[0] : textCellNodes
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
