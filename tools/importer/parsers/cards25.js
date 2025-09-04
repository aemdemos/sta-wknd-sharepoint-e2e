/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the list of cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Table header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Find image (first cell)
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        // Find the actual <img>
        const img = imageDiv.querySelector('img');
        if (img) imageEl = img;
      }
    }

    // Find text content (second cell)
    const textContent = [];
    // Title (as heading)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
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
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textContent.push(descP);
    }
    // Call-to-action (optional, use title link if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already included as heading
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Read more';
      textContent.push(cta);
    }

    // Build row
    rows.push([
      imageEl || '',
      textContent
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
