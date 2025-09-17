/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the UL containing all cards
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((li) => {
    // Find image (first cell)
    let imageEl = li.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imageEl) {
      imageEl = document.createElement('span');
      imageEl.textContent = '[No image]';
    }

    // Find title link and title text
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleEl = null;
    if (titleSpan) {
      // Use heading for title
      titleEl = document.createElement('h3');
      titleEl.textContent = titleSpan.textContent;
    }

    // Find description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Find CTA (use titleLink if present)
    let ctaEl = null;
    if (titleLink && titleLink.href) {
      // Only add CTA if link is not just for the image
      ctaEl = document.createElement('a');
      ctaEl.href = titleLink.href;
      ctaEl.textContent = titleSpan ? titleSpan.textContent : titleLink.textContent;
    }

    // Compose content cell
    const contentCell = [];
    if (titleEl) contentCell.push(titleEl);
    if (descEl) contentCell.push(descEl);
    // Only add CTA if it's not duplicating the heading link
    // In this markup, the heading is not a link, so add CTA
    if (ctaEl) contentCell.push(ctaEl);

    // Add row: [image, content]
    rows.push([imageEl, contentCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
