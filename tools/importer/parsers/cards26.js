/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Select all cards in the image list
  const cardItems = element.querySelectorAll('ul > li');

  cardItems.forEach((li) => {
    // Image cell: first <img> in the card
    const imageEl = li.querySelector('img');

    // Text content cell: Title (bold, in link if present), then description
    let titleNode;
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Always use <strong> for the title
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      if (titleLink) {
        // Use the existing link, empty it, put <strong> inside
        while (titleLink.firstChild) titleLink.removeChild(titleLink.firstChild);
        titleLink.appendChild(strong);
        titleNode = titleLink;
      } else {
        titleNode = strong;
      }
    }

    // Description (optional)
    const descriptionSpan = li.querySelector('.cmp-image-list__item-description');

    // Compose cell contents, preserving formatting
    const textCellContent = [];
    if (titleNode) textCellContent.push(titleNode);
    if (descriptionSpan) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(descriptionSpan);
    }

    rows.push([
      imageEl,
      textCellContent.length === 1 ? textCellContent[0] : textCellContent,
    ]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
