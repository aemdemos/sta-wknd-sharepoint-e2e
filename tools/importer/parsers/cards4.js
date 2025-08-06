/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list section for cards under 'All Articles'
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  const rows = [];
  // Block header: must match exactly
  rows.push(['Cards (cards4)']);

  // For each card item
  imageList.querySelectorAll(':scope > li').forEach((li) => {
    // Find the card image (mandatory)
    let imageEl = null;
    const imgHolder = li.querySelector('.cmp-image-list__item-image .cmp-image');
    if (imgHolder) {
      imageEl = imgHolder.querySelector('img');
    }

    // Gather text content: title (strong), description, CTA if present
    // Create a container div for the text cell
    const textCell = document.createElement('div');

    // Title (as <strong>), from the .cmp-image-list__item-title if present
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }

    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      textCell.appendChild(document.createTextNode(descSpan.textContent.trim()));
    }

    // CTA (future-proofing, if a non-image, non-title link exists)
    const ctaLink = Array.from(li.querySelectorAll('a')).find(a =>
      !a.classList.contains('cmp-image-list__item-image-link') &&
      !a.classList.contains('cmp-image-list__item-title-link')
    );
    if (ctaLink) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(ctaLink);
    }
    // Each row: [image, text cell]
    rows.push([imageEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
