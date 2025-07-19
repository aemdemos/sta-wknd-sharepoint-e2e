/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly matching the example
  const headerRow = ['Cards (cards27)'];
  const rows = [];
  // Select all card items in the block
  const cards = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  cards.forEach((li) => {
    // IMAGE CELL
    let imageCell = null;
    const img = li.querySelector('img');
    if (img) {
      imageCell = img;
    }
    // TEXT CELL
    const textCell = [];
    const article = li.querySelector('article');
    // Title (styled as heading, with link if present)
    const titleLink = article ? article.querySelector('a.cmp-image-list__item-title-link') : null;
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      // Use <strong> for heading, wrap in link if link exists
      let heading;
      if (titleLink && titleLink.href) {
        heading = document.createElement('a');
        heading.href = titleLink.href;
        heading.appendChild(document.createElement('strong')).append(titleSpan);
      } else {
        heading = document.createElement('strong');
        heading.append(titleSpan);
      }
      textCell.push(heading);
    }
    // Description (if present)
    const desc = article ? article.querySelector('.cmp-image-list__item-description') : null;
    if (desc) {
      if (textCell.length > 0) textCell.push(document.createElement('br'));
      textCell.push(desc);
    }
    // Add row only if there is an image and at least some text
    if (imageCell && textCell.length > 0) {
      rows.push([imageCell, textCell]);
    }
  });
  // Compose table rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
