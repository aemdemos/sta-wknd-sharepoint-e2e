/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list container
  const imageList = element.querySelector('ul.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Find the image (first cell)
    let imgEl = null;
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Defensive fallback
    if (!imgEl) {
      imgEl = li.querySelector('img');
    }

    // Find the text content (second cell)
    const textEls = [];
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const heading = document.createElement('h3');
        heading.textContent = titleSpan.textContent;
        textEls.push(heading);
      }
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
      textEls.push(descP);
    }
    // Call-to-action (use title link if present)
    if (titleLink && titleLink.href) {
      // Only add CTA if not already included as heading
      const cta = document.createElement('a');
      cta.href = titleLink.href;
      cta.textContent = 'Learn more';
      textEls.push(cta);
    }

    // Build the row: [image, text content]
    rows.push([
      imgEl,
      textEls
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
