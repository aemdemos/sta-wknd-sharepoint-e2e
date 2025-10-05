/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Defensive: Find all immediate <li> children (cards)
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Each card
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image: find the <img> inside the image link
    let img = null;
    const imgLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }

    // Text content: title, description, call-to-action
    // Title: <span class="cmp-image-list__item-title">
    const titleSpan = article.querySelector('span.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      // Wrap title in <strong> for heading style (matches example)
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent;
    }

    // Description: <span class="cmp-image-list__item-description">
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    let descEl = null;
    if (descSpan) {
      descEl = document.createElement('p');
      descEl.textContent = descSpan.textContent;
    }

    // Call-to-action: link to article (if present)
    // Use the title link (not the image link)
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    let ctaEl = null;
    if (titleLink && titleLink.href) {
      ctaEl = document.createElement('a');
      ctaEl.href = titleLink.href;
      ctaEl.textContent = 'Read more';
    }

    // Compose text cell: title, description, call-to-action
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);

    // Compose row: [image, text]
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
