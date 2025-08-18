/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Select all card items (rows)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Extract image (first cell)
    let imageCell = '';
    const img = item.querySelector('img.cmp-image__image');
    if (img) {
      imageCell = img;
    }
    // Extract text content (second cell)
    const fragments = [];
    // Title in cmp-image-list__item-title
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        // Use <strong> for heading (not markdown)
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        fragments.push(strong);
      }
    }
    // Description below title
    const desc = item.querySelector('span.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (fragments.length) {
        fragments.push(document.createElement('br'));
      }
      fragments.push(desc);
    }
    // If nothing is in fragments, ensure cell isn't empty
    const textCell = fragments.length ? fragments : '';
    // Add table row
    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
