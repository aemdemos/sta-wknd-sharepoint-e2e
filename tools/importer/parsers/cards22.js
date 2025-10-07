/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards22) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find the image-list container
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // Defensive: fallback if not found
  const ul = imageList ? imageList.querySelector('ul.cmp-image-list') : element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card (li)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image: find the actual <img> element within the card
    let img = li.querySelector('img');
    // Defensive: if image is wrapped in extra divs, get the first img
    if (!img) {
      const imgs = li.querySelectorAll('img');
      img = imgs.length ? imgs[0] : null;
    }

    // Text cell: title, description, CTA (if present)
    const textContent = [];

    // Title: find the span with class 'cmp-image-list__item-title', wrap in <strong>
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
      textContent.push(titleEl);
    }

    // Description: find the span with class 'cmp-image-list__item-description'
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
      textContent.push(descEl);
    }

    // CTA: use the title link if present
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink && titleLink.href) {
      // Only add CTA if link is not already used for the title
      // (If the title is inside the link, don't duplicate)
      if (!titleLink.contains(titleSpan)) {
        const ctaEl = document.createElement('a');
        ctaEl.href = titleLink.href;
        ctaEl.textContent = titleLink.textContent.trim();
        textContent.push(ctaEl);
      }
    }

    // Compose row: [image, text]
    const cardRow = [img, textContent];
    rows.push(cardRow);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
