/* global WebImporter */
export default function parse(element, { document }) {
  // --- Header row setup (exact name from spec)
  const headerRow = ['Cards (cards26)'];

  // --- Find all card <li> elements
  const cardEls = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [];

  cardEls.forEach((li) => {
    // --- IMAGE CELL (always present in provided HTML)
    let imageContainer = li.querySelector('.cmp-image-list__item-image');
    // Reference the div containing the image directly
    let imageCell = imageContainer || null;

    // --- TEXT CELL (may include heading with link, description)
    const textCellContent = [];

    // Title and link
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleLink && titleSpan) {
      // Use the existing <a> (but remove children first so we can use only the <span> inside)
      while (titleLink.firstChild) titleLink.removeChild(titleLink.firstChild);
      // Use <strong> for the heading text
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent.trim();
      titleLink.appendChild(heading);
      textCellContent.push(titleLink);
    } else if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent.trim();
      textCellContent.push(heading);
    }

    // Description
    const descEl = li.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descEl.textContent.trim();
      textCellContent.push(descDiv);
    }

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  if (rows.length === 0) {
    // If there are no cards, do not replace the element
    return;
  }

  // --- Compose final table structure
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
