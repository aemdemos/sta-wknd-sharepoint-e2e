/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (cards)
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item'));
  if (!cards.length) return;

  // Prepare table rows
  const rows = [];
  rows.push(["Cards (cards4)"]); // Header row exactly as shown in the markdown example

  cards.forEach(card => {
    // Image cell: reference the image wrapper (contains <img>)
    let imageWrapper = card.querySelector('.cmp-image-list__item-image');
    let imageCell = imageWrapper || '';

    // Text cell: reference the content block (title, description)
    // We'll select the full article content for maximum resilience
    let contentBlock = card.querySelector('.cmp-image-list__item-content');
    let textCell = contentBlock || '';
    
    rows.push([imageCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
