/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly as required
  const headerRow = ['Cards (cards21)'];
  const cards = [];

  // Select all direct card items
  const items = element.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: reference the original img element
    const img = item.querySelector('img.cmp-image__image');

    // Title: use existing span element as strong heading
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    let headingEl = null;
    if (titleSpan && titleSpan.textContent.trim()) {
      // Wrap the span content in <strong> as per example
      headingEl = document.createElement('strong');
      headingEl.textContent = titleSpan.textContent.trim();
    }

    // Description: use original span element, but as a paragraph for proper HTML semantics
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent.trim();
    }

    // Compose content cell
    const cardContent = [];
    if (headingEl) cardContent.push(headingEl);
    if (descEl) cardContent.push(descEl);

    // Each row is [image, text]
    cards.push([img, cardContent]);
  });

  const tableCells = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
