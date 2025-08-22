/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block within the element
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  // Table header: block name, one column only, matches example
  const cells = [['Cards (cards4)']];

  // For each card in the image list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
    // Get the image element (reference, do not clone)
    const img = li.querySelector('img');

    // Gather text content for the card
    const textContent = [];

    // Title: use the .cmp-image-list__item-title (inside link), as h3
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = titleSpan.textContent.trim();
      textContent.push(h);
    }

    // Description: use the .cmp-image-list__item-description
    const descEl = li.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      // Use <p> for description as in example
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textContent.push(p);
    }

    // CTA: Use the .cmp-image-list__item-title-link href (if present)
    const link = li.querySelector('.cmp-image-list__item-title-link');
    if (link && link.href) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = 'Read More';
      textContent.push(a);
    }

    // If none of the above, fallback to all text (edge case)
    if (textContent.length === 0) {
      const fallback = document.createElement('div');
      fallback.textContent = li.textContent.trim();
      textContent.push(fallback);
    }

    // Add the card row to the table; always two columns: [image, text content]
    cells.push([
      img ? img : '',
      textContent
    ]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
