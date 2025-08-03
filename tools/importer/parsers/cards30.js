/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all card items in the image-list
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // --- First cell: Image (as element) ---
    // Find the image inside the card (first <img>)
    const img = item.querySelector('img');
    // If no image, leave cell empty/null
    const imgCell = img || '';

    // --- Second cell: Text content ---
    // Get the title (as a link with span inside)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    // Defensive: title can be null if the structure is broken
    let titleElem = '';
    if (titleLink) {
      // Use the existing link element
      titleElem = titleLink;
    }
    // Get the description span
    const descElem = item.querySelector('span.cmp-image-list__item-description');
    // Defensive: description can be null
    let desc = '';
    if (descElem) {
      desc = descElem;
    }
    // Consolidate text cell; if both present, include both, else fallback
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (desc) textCell.push(desc);
    // If neither is present, keep as empty string (shouldn't happen on valid source)
    rows.push([imgCell, textCell.length ? textCell : '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
