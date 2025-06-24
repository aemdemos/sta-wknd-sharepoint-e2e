/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per the block name
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Locate the list of card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach(item => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // 1. IMAGE CELL: Reference direct image container (div) with <img> inside
    // Locate: a > div.cmp-image-list__item-image
    let imageCell = null;
    const imgLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      const imgDiv = imgLink.querySelector('.cmp-image-list__item-image');
      if (imgDiv) {
        imageCell = imgDiv;
      }
    }

    // 2. TEXT CELL: strong title + description (all sourced from existing elements)
    // Title: <a class="cmp-image-list__item-title-link"> contains <span class="cmp-image-list__item-title">
    // Description: <span class="cmp-image-list__item-description">
    let textFragments = [];
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      // Use <strong> and reference the span inside if possible
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textFragments.push(strong);
      }
    }
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      // If we already have a title, add a <br> for separation
      if (textFragments.length > 0) {
        textFragments.push(document.createElement('br'));
      }
      textFragments.push(descSpan);
    }
    // Place all text in a single cell (strong and span, with br if both)
    rows.push([
      imageCell,
      textFragments
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
