/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards21)'];
  const cards = element.querySelectorAll('.cmp-image-list__item');
  const rows = [headerRow];

  cards.forEach(card => {
    // Image cell: find the first <img> inside this card
    let img = card.querySelector('img');

    // Text cell: collect title, description, and CTA
    const textCell = [];

    // Title
    const titleSpan = card.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Use <strong> for heading style, as per example
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent.trim();
      textCell.push(strong);
    }

    // Description
    const descSpan = card.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // Description goes below title
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textCell.push(p);
    }

    // CTA: If the title is wrapped in a link, append the link as CTA at the bottom IF it's different from the title text
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (
      titleLink &&
      titleLink.getAttribute('href') &&
      titleSpan &&
      titleLink.textContent.trim() !== titleSpan.textContent.trim()
    ) {
      // Use the link as CTA
      textCell.push(titleLink);
    }

    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
