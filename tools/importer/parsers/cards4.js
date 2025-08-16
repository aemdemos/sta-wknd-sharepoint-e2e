/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block (cards container)
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageList) return;

  // Table header: matches example exactly
  const headerRow = ['Cards (cards4)'];
  const rows = [];

  // For each card (li)
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image: use the existing <img> element if present
    let img = li.querySelector('img');

    // Text cell construction
    const textContent = [];

    // Title: in .cmp-image-list__item-title (inside a link)
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textContent.push(strong);
    }

    // Description: in .cmp-image-list__item-description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textContent.push(descDiv);
    }

    // CTA: if a link exists, and the href is meaningful
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.getAttribute('href') && titleSpan && titleSpan.textContent.trim()) {
      const ctaDiv = document.createElement('div');
      const ctaLink = document.createElement('a');
      ctaLink.href = titleLink.getAttribute('href');
      ctaLink.textContent = titleSpan.textContent.trim();
      ctaDiv.appendChild(ctaLink);
      textContent.push(ctaDiv);
    }

    // Combine all text content. If nothing, fallback to all text in li
    let cellContent;
    if (textContent.length > 0) {
      cellContent = textContent;
    } else {
      const fallbackText = li.textContent.trim();
      cellContent = fallbackText ? fallbackText : '';
    }

    // Each row: [image, text block]
    rows.push([
      img || '',
      cellContent
    ]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}