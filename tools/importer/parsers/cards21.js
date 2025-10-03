/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Defensive: find the image-list container
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Get all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Find image element
    let imageEl = item.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imageEl) {
      // Try to find any img inside the item
      imageEl = item.querySelector('img');
    }

    // Find title (as heading)
    let titleSpan = item.querySelector('.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Find description
    let descSpan = item.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Find CTA link (use title link if present)
    let ctaLink = item.querySelector('.cmp-image-list__item-title-link');
    let ctaEl = null;
    if (ctaLink) {
      ctaEl = document.createElement('a');
      ctaEl.href = ctaLink.getAttribute('href');
      ctaEl.textContent = ctaLink.textContent.trim();
    }

    // Compose text cell content
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);

    // Compose row: [image, text]
    rows.push([
      imageEl ? imageEl : '',
      textCell.length ? textCell : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
