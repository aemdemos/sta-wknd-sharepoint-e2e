/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the text cell for each card
  function createTextCell(article) {
    // Find the title link and description span
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose the text cell content
    const cellContent = [];
    if (titleSpan) {
      // Wrap the title in a <strong> for heading effect
      const strong = document.createElement('strong');
      strong.append(titleSpan.textContent);
      cellContent.push(strong);
    }
    if (descriptionSpan) {
      // Add a <div> for the description
      const descDiv = document.createElement('div');
      descDiv.append(descriptionSpan.textContent);
      cellContent.push(descDiv);
    }
    // Optionally, add the CTA link if needed (not present in this HTML)
    return cellContent;
  }

  // Find all card items
  const items = element.querySelectorAll('li.cmp-image-list__item');
  const rows = [];
  // Header row as per block requirements
  rows.push(['Cards (cards26)']);

  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // Image cell: find the <img> inside the image link
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Defensive: if no image, skip this card
    if (!imageEl) return;
    // Text cell
    const textCell = createTextCell(article);
    rows.push([imageEl, textCell]);
  });

  // Create the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
