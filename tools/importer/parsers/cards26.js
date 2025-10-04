/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image element from a card
  function getCardImage(card) {
    // Find the image inside the card
    const img = card.querySelector('img');
    return img;
  }

  // Helper to extract text content (title, description, link) from a card
  function getCardText(card) {
    // Title: <a class="cmp-image-list__item-title-link"> <span class="cmp-image-list__item-title">
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    let title = null;
    if (titleLink) {
      title = titleLink.querySelector('.cmp-image-list__item-title');
    }
    // Description: <span class="cmp-image-list__item-description">
    const description = card.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const cellContent = [];
    if (title) {
      // Use <strong> for heading style (could use <h3> but strong is more resilient)
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      cellContent.push(strong);
    }
    if (description) {
      // Add a <div> for description for spacing
      const descDiv = document.createElement('div');
      descDiv.textContent = description.textContent;
      cellContent.push(descDiv);
    }
    // Optionally, add CTA link if present (not in this HTML, but block supports it)
    if (titleLink && titleLink.href) {
      // Only add if not already included as title
      // (In this source, title is inside the link)
      // If needed, could add a CTA link at the bottom
    }
    return cellContent;
  }

  // Find all card items
  const cards = Array.from(element.querySelectorAll(':scope ul.cmp-image-list > li.cmp-image-list__item'));

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards26)']);

  // Each card row: [image, text]
  cards.forEach(card => {
    const article = card.querySelector('article');
    if (!article) return;
    // Image cell
    const img = getCardImage(article);
    // Text cell
    const textCell = getCardText(article);
    // Defensive: only add row if image and text
    if (img && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
