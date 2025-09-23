/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find all direct card items
  const items = Array.from(element.querySelectorAll(':scope ul.cmp-image-list > li.cmp-image-list__item'));

  // Table header row (block name)
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each card's content is inside article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find first img inside the image link
    let image = article.querySelector('a.cmp-image-list__item-image-link img');
    // Defensive: fallback to any img inside article
    if (!image) image = article.querySelector('img');

    // Text cell: Title (as heading), Description, and CTA (link)
    // Title: use the span inside the title link
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    let titleEl = null;
    if (titleSpan) {
      // Make a heading element (h3)
      titleEl = document.createElement('h3');
      titleEl.textContent = titleSpan.textContent;
      // If the title is a link, wrap heading in link
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.textContent = titleSpan.textContent;
        titleEl.textContent = '';
        titleEl.appendChild(link);
      }
    }

    // Description
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // CTA: If titleLink exists, add as CTA link at the bottom (but not if already used for heading)
    let ctaEl = null;
    if (titleLink && titleLink.href) {
      ctaEl = document.createElement('p');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = 'Read more';
      ctaEl.appendChild(link);
    }

    // Compose text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    // Only add CTA if not redundant (don't add if heading is a link)
    if (ctaEl && (!titleEl || !titleEl.querySelector('a'))) textCellContent.push(ctaEl);

    // Build row: image in first cell, text in second cell
    rows.push([
      image,
      textCellContent
    ]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
