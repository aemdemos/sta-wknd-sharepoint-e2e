/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell for each card
  function createTextCell(article) {
    const frag = document.createDocumentFragment();
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> for heading style, as in the markdown example
      const strong = document.createElement('strong');
      // Move the title span into the strong
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        strong.textContent = titleSpan.textContent;
      } else {
        strong.textContent = titleLink.textContent;
      }
      frag.appendChild(strong);
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Add a <br> if there is a title
      if (frag.childNodes.length > 0) {
        frag.appendChild(document.createElement('br'));
      }
      frag.appendChild(desc);
    }
    return frag;
  }

  // Find all card items
  const items = element.querySelectorAll('li.cmp-image-list__item');
  const rows = [];
  // Header row
  rows.push(['Cards (cards26)']);

  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // Image cell: find the <img> inside the image link
    let img = article.querySelector('.cmp-image-list__item-image-link img');
    // Defensive: if not found, try any img
    if (!img) img = article.querySelector('img');
    // Text cell
    const textCell = createTextCell(article);
    // Only add row if image and text exist
    if (img && textCell) {
      rows.push([img, textCell]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
