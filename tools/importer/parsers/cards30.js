/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards30)'];

  // 2. Find all card items (li.cmp-image-list__item)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  // 3. Build rows for each card
  const rows = Array.from(cardItems).map((li) => {
    // Image extraction: find the image inside the card
    const img = li.querySelector('img');

    // Text content: title, description, and link
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    const descriptionSpan = li.querySelector('span.cmp-image-list__item-description');

    // Compose text cell
    const textCell = document.createElement('div');
    // Title (as heading)
    if (titleSpan) {
      const heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
      textCell.appendChild(heading);
    }
    // Description
    if (descriptionSpan) {
      const desc = document.createElement('div');
      desc.textContent = descriptionSpan.textContent;
      textCell.appendChild(desc);
    }
    // CTA (link)
    if (titleLink) {
      // Only add link if not already used for title
      // (in this pattern, title is the link, so skip duplicate CTA)
    }
    return [img, textCell];
  });

  // 4. Compose table cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element
  element.replaceWith(table);
}
