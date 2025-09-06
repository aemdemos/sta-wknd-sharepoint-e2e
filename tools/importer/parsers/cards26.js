/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing the cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Defensive: find the article containing card content
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image link (contains the image)
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imageCell = null;
    if (imageLink) {
      // Find the image element inside the link
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        // fallback: use the whole imageLink if no img found
        imageCell = imageLink;
      }
    }

    // --- Text cell ---
    // Title link (contains the title span)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleElem = null;
    if (titleLink) {
      // Use the span inside the link as the heading
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Create a heading element for semantic structure
        const heading = document.createElement('h3');
        heading.textContent = span.textContent;
        titleElem = heading;
      }
    }

    // Description
    const descElem = article.querySelector('.cmp-image-list__item-description');
    // Compose text cell contents
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (descElem) textCellContent.push(descElem);

    // Add row for this card
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
