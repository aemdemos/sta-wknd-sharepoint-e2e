/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have the expected UL structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Table header row as required
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all card items
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Defensive: find the article containing the card content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    let imageEl = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback if not found
    if (!imageEl) {
      // Try to find any img inside the article
      imageEl = article.querySelector('img');
    }
    // If still not found, skip this card
    if (!imageEl) return;

    // --- TEXT CELL ---
    // Find the title link and span
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;

    // Find the description span
    const descSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (titleSpan) {
      // Wrap title in <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellContent.push(strong);
    }
    if (descSpan) {
      // Add description below title
      textCellContent.push(document.createElement('br'));
      textCellContent.push(descSpan);
    }
    // Optionally add CTA if present (not in this HTML, but future-proof)
    // Example: find a link that is not the image or title link
    const ctaLinks = Array.from(article.querySelectorAll('a')).filter(a => {
      return !a.classList.contains('cmp-image-list__item-image-link') && !a.classList.contains('cmp-image-list__item-title-link');
    });
    if (ctaLinks.length > 0) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(...ctaLinks);
    }

    // Add row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
