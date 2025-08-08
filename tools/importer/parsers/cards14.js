/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];
  // Get all card <li>s
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: inside <a> -> <div> -> <img>
    let imgEl = null;
    const imgLink = item.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Text cell: Title + Description (and CTA if present)
    const textParts = [];
    // Title: usually inside <a.cmp-image-list__item-title-link>
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      // Try to find the span.title inside
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Reference the title span itself, not clone or wrap
        textParts.push(titleSpan);
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // If there is a title, add a <br> between title and description
      if (textParts.length > 0) {
        textParts.push(document.createElement('br'));
      }
      textParts.push(desc);
    }
    // If neither title nor description, put empty string as fallback
    const textCell = textParts.length > 0 ? textParts : '';
    const row = [imgEl, textCell];
    cells.push(row);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}