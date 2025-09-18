/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: check for the expected UL structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Header row as required
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Get all LI items (cards)
  const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let imgEl = null;
    const imageLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const imageDiv = imageLink.querySelector('.cmp-image-list__item-image');
      if (imageDiv) {
        imgEl = imageDiv.querySelector('img');
      }
    }
    // Defensive fallback: if not found, skip this card
    if (!imgEl) return;

    // Find text content (second cell)
    const textContent = [];
    // Title
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use a heading element for semantic structure
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('h3');
        heading.append(titleSpan.textContent);
        textContent.push(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.append(descSpan.textContent);
      textContent.push(descP);
    }
    // CTA (use title link if present)
    if (titleLink) {
      // Only add CTA if it's not already used as heading
      const cta = document.createElement('a');
      cta.href = titleLink.getAttribute('href');
      cta.textContent = 'Read more';
      textContent.push(cta);
    }

    // Add row: [image, textContent]
    rows.push([imgEl, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
