/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero block (look for .cmp-teaser--hero or .cmp-teaser)
  const hero = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!hero) return;

  // 1. Get the background image (optional)
  let bgImage = null;
  const imgDiv = hero.querySelector('.cmp-teaser__image, [data-cmp-is="image"]');
  if (imgDiv) {
    const img = imgDiv.querySelector('img');
    if (img) bgImage = img;
  }

  // 2. Get the content: title, subheading, CTA, etc.
  // Only use direct children of .cmp-teaser__content (if exists), else hero
  const content = hero.querySelector('.cmp-teaser__content') || hero;
  let contentElements = [];
  // If content has children, use them all in order; else, fallback to text
  if (content.children.length > 0) {
    contentElements = Array.from(content.children);
  } else if (content.textContent && content.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = content.textContent.trim();
    contentElements = [p];
  }

  // Compose the table according to the block requirements
  // First row: header
  const rows = [];
  rows.push(['Hero (hero3)']);
  // Second row: background image (if any)
  rows.push([bgImage ? bgImage : '']);
  // Third row: all text elements in order
  rows.push([contentElements]);
  
  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
