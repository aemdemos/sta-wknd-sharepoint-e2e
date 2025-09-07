/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element contains the expected list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Find the image (first cell)
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    let imageEl = null;
    if (imageLink) {
      // Defensive: Find the actual <img> inside the image link
      imageEl = imageLink.querySelector('img');
      // If the image is wrapped in a div, use the parent div for context
      if (imageEl && imageEl.parentElement.classList.contains('cmp-image')) {
        imageEl = imageEl.parentElement;
      }
    }
    // If no image found, fallback to null
    if (!imageEl) imageEl = document.createTextNode('');

    // Find the text content (second cell)
    const textContent = [];
    // Title as heading
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Create heading element
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // Call-to-action (optional, use the title link if present)
    if (titleLink && titleLink.href) {
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.push(cta);
    }

    rows.push([imageEl, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
