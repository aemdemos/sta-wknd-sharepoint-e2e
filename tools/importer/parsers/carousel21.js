/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image list block
  const imageList = element.querySelector('.image-list.list, ul.cmp-image-list') || element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Find all image list items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Table header
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  // For each item, build a row: [image, text content]
  items.forEach((item) => {
    // Defensive: Find the article content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image link and image element
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual image element inside
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    // If no image found, skip row
    if (!imageCell) return;

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element
        const heading = document.createElement('h2');
        heading.textContent = titleSpan.textContent;
        textCellContent.push(heading);
      }
    }
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent.trim();
      textCellContent.push(descP);
    }
    // Call-to-action (link)
    // If the title link exists, and has an href, add as CTA at the bottom
    if (titleLink && titleLink.href) {
      // Only add CTA if not already present in title
      const cta = document.createElement('p');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleLink.textContent.trim();
      cta.appendChild(link);
      textCellContent.push(cta);
    }
    // If no text content, use empty string
    const textCell = textCellContent.length ? textCellContent : '';

    rows.push([imageCell, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
