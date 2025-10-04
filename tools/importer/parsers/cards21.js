/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list block (the cards container)
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // For each card, build a row: [image, text content]
  items.forEach((item) => {
    // Defensive: Find the main content container
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // --- Image cell ---
    // Find the image link and image element
    let imageCell = null;
    const imageLink = content.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        // Find the actual <img> element
        const img = imageDiv.querySelector('img');
        if (img) {
          imageCell = img;
        }
      }
    }
    // Fallback: If no image found, skip this card
    if (!imageCell) return;

    // --- Text cell ---
    // Title (as heading)
    let title = '';
    const titleLink = content.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create a heading element
        const h3 = document.createElement('h3');
        h3.textContent = titleSpan.textContent.trim();
        title = h3;
      }
    }
    // Description
    let desc = '';
    const descSpan = content.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Create a paragraph element
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      desc = p;
    }
    // Call-to-action: If the title link is present, use its href as a CTA
    let cta = null;
    if (titleLink && titleLink.href) {
      // Only add CTA if the href is not just '#'
      if (titleLink.getAttribute('href') && titleLink.getAttribute('href') !== '#') {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = 'Learn more';
        cta = a;
      }
    }
    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
