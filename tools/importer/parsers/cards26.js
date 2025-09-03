/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists and is a container for the cards
  if (!element) return;

  // Header row as required by block spec
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all card items (li elements)
  const cardItems = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cardItems.forEach((li) => {
    // Defensive: ensure li exists
    if (!li) return;
    // Find the main content container
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image container
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // The image is inside the link
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        const cmpImage = imageDiv.querySelector('.cmp-image');
        if (cmpImage) {
          const img = cmpImage.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }
    }
    // Defensive fallback: if image not found, skip this card
    if (!imageCell) return;

    // --- TEXT CELL ---
    // Title (as heading)
    let titleEl = article.querySelector('.cmp-image-list__item-title');
    let titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let heading = null;
    if (titleEl) {
      // Create a heading element (h3) and preserve link if present
      heading = document.createElement('h3');
      if (titleLink) {
        // Clone the link and move the span inside
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href') || '#';
        link.innerHTML = titleEl.textContent;
        heading.appendChild(link);
      } else {
        heading.textContent = titleEl.textContent;
      }
    }

    // Description
    let descEl = article.querySelector('.cmp-image-list__item-description');
    let description = null;
    if (descEl) {
      description = document.createElement('p');
      description.textContent = descEl.textContent;
    }

    // Compose text cell
    const textCellContent = [];
    if (heading) textCellContent.push(heading);
    if (description) textCellContent.push(description);

    // Add row to table
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
