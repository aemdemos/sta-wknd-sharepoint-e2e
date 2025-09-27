/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a card
  function getCardImage(card) {
    // The image is inside: a.cmp-image-list__item-image-link > div > div > img
    const imgLink = card.querySelector('.cmp-image-list__item-image-link');
    if (!imgLink) return null;
    const img = imgLink.querySelector('img');
    return img || null;
  }

  // Helper to extract the title as a heading element
  function getCardTitle(card) {
    // The title is inside: a.cmp-image-list__item-title-link > span.cmp-image-list__item-title
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (!titleLink) return null;
    const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
    if (!titleSpan) return null;
    const h3 = document.createElement('h3');
    h3.textContent = titleSpan.textContent.trim();
    return h3;
  }

  // Helper to extract the description
  function getCardDescription(card) {
    // The description is in span.cmp-image-list__item-description
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (!desc) return null;
    // Use a <p> for the description
    const p = document.createElement('p');
    p.textContent = desc.textContent.trim();
    return p;
  }

  // Helper to extract the CTA link (if any)
  function getCardCTA(card) {
    // The CTA is the title link (could be used as a CTA at the bottom)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (!titleLink) return null;
    // Only add as CTA if the link has an href
    const href = titleLink.getAttribute('href');
    if (!href) return null;
    // If the link is already used for the title, skip adding as CTA
    // But if you want to add a CTA at the bottom, you can clone it
    // For this block, the CTA is optional and not visually present in the screenshots, so skip unless required
    return null;
  }

  // Find all cards
  const cards = Array.from(element.querySelectorAll('.cmp-image-list > .cmp-image-list__item'));

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards21)']);

  // Card rows
  cards.forEach((card) => {
    const img = getCardImage(card);
    const title = getCardTitle(card);
    const desc = getCardDescription(card);
    const cta = getCardCTA(card); // Usually null for this block

    // Compose the text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);

    rows.push([
      img || '',
      textCell.length > 0 ? textCell : '',
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
