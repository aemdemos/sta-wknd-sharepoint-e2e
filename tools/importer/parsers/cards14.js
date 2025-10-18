/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block parser
  // Header row as required
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find the card list container (ul.cmp-image-list)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card (li.cmp-image-list__item)
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image: find the first <img> inside the card
    const img = li.querySelector('img');
    // Defensive: if no image, skip this card
    if (!img) return;

    // Text content: title, description, and optional CTA
    // Title: <a class="cmp-image-list__item-title-link"> > <span class="cmp-image-list__item-title">
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    let titleElem = null;
    if (titleSpan) {
      // Wrap title in <strong> for heading style
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent.trim();
    }

    // Description: <span class="cmp-image-list__item-description">
    const descSpan = li.querySelector('span.cmp-image-list__item-description');
    let descElem = null;
    if (descSpan) {
      descElem = document.createElement('p');
      descElem.textContent = descSpan.textContent.trim();
    }

    // CTA: use the title link as the CTA if present
    let ctaElem = null;
    if (titleLink && titleLink.href) {
      ctaElem = document.createElement('a');
      ctaElem.href = titleLink.href;
      ctaElem.textContent = 'Read more';
    }

    // Compose the text cell content
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) textCell.push(descElem);
    if (ctaElem) textCell.push(ctaElem);

    // Add the row: [image, text content]
    rows.push([
      img,
      textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
