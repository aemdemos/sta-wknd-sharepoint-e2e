/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the image-list block
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  // Get all card items
  const items = imageList
    ? imageList.querySelectorAll('li.cmp-image-list__item')
    : element.querySelectorAll('li.cmp-image-list__item');

  // Table header
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Defensive: find the article
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Find image (first cell)
    let img = article.querySelector('.cmp-image-list__item-image img');
    // Defensive: fallback to any img
    if (!img) img = article.querySelector('img');

    // Find title (second cell)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    // Compose title as heading
    let heading = null;
    if (titleSpan) {
      heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent;
    }

    // Find description
    const description = article.querySelector('.cmp-image-list__item-description');
    let descriptionEl = null;
    if (description) {
      descriptionEl = document.createElement('p');
      descriptionEl.textContent = description.textContent;
    }

    // Compose text cell
    const textCell = [];
    if (heading) textCell.push(heading);
    if (descriptionEl) textCell.push(descriptionEl);
    // Optionally add CTA (the title link if present)
    if (titleLink) {
      // Only add CTA if it has an href and is not just the heading
      if (titleLink.href && !titleLink.contains(heading)) {
        textCell.push(titleLink);
      }
    }

    rows.push([
      img || '',
      textCell.length ? textCell : '',
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
