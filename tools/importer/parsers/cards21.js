/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  // Table header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all card items
  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // Find the article containing card content
    const article = item.querySelector('.cmp-image-list__item-content');
    if (!article) return;

    // Get image (first cell)
    let imgEl = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback to any img inside article
    if (!imgEl) imgEl = article.querySelector('img');
    // Defensive: if no image, skip this card
    if (!imgEl) return;

    // Get title (as heading)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';
    let headingEl = null;
    if (titleText) {
      headingEl = document.createElement('h3');
      headingEl.textContent = titleText;
    }

    // Get description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Get CTA (use title link if present)
    let ctaEl = null;
    if (titleLink && titleLink.href) {
      ctaEl = document.createElement('a');
      ctaEl.href = titleLink.href;
      ctaEl.textContent = titleText || titleLink.textContent.trim();
    }

    // Compose text cell
    const textCell = [];
    if (headingEl) textCell.push(headingEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);

    // Add row: [image, text content]
    rows.push([imgEl, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
