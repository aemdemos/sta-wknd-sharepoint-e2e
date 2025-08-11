/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as in example
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find the carousel content
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  // Get all slide items
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // IMAGE: in the first cell, must be an <img> element
    let imgEl = item.querySelector('.cmp-teaser__image img');
    if (!imgEl) {
      imgEl = item.querySelector('img');
    }

    // TEXT CELL: Title, Description, CTA (if present)
    const cellContent = [];
    // Title: Heading (use h2 if found, else fallback to first heading)
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      let titleEl = teaserContent.querySelector('.cmp-teaser__title, h1, h2, h3');
      if (titleEl) {
        // Use the element as-is for semantic heading
        cellContent.push(titleEl);
      }
      // Description
      let descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) {
        // Some descriptions have <p> or plain text
        if (descEl.children.length > 0) {
          Array.from(descEl.childNodes).forEach((node) => {
            cellContent.push(node);
          });
        } else {
          cellContent.push(document.createTextNode(descEl.textContent.trim()));
        }
      }
      // CTA
      let actionLink = teaserContent.querySelector('.cmp-teaser__action-link');
      if (actionLink) {
        cellContent.push(actionLink);
      }
    }

    // If no content found, fallback to all text in item (should not occur in provided HTML)
    if (cellContent.length === 0) {
      cellContent.push(document.createTextNode(item.textContent.trim()));
    }

    // Table row: image in first cell, array of elements in second
    cells.push([
      imgEl,
      cellContent
    ]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
