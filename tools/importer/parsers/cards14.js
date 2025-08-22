/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we create the header exactly as required
  const headerRow = ['Cards (cards14)'];
  const rows = [];
  // Get all card items
  const items = element.querySelectorAll('.cmp-image-list__item');
  items.forEach((item) => {
    // Image cell: get <img> inside the .cmp-image-list__item-image
    const imgContainer = item.querySelector('.cmp-image-list__item-image');
    // Use the actual <img> tag if present
    let imgEl = imgContainer ? imgContainer.querySelector('img') : null;
    // Text cell: title as heading, description below
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Title as <strong>, to match heading style from block example
    let heading = null;
    if (titleSpan) {
      heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
    }
    // Description
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    let descNode = descSpan ? document.createTextNode(descSpan.textContent) : null;
    // Build the text cell: heading first, then description below
    const textCellContents = [];
    if (heading) textCellContents.push(heading);
    if (descNode) {
      if (heading) textCellContents.push(document.createElement('br'));
      textCellContents.push(descNode);
    }
    // Push row: image cell, text cell
    rows.push([imgEl, textCellContents]);
  });
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
