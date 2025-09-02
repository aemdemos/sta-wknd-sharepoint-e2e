/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example: 'Cards (cards16)'
  const headerRow = ['Cards (cards16)'];
  const tableRows = [headerRow];
  // Find all card list items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Each li contains an article with the card content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return; // skip if missing
    // IMAGE: get the <img> inside cmp-image-list__item-image-link
    let imgEl = null;
    const imageLink = article.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      imgEl = imageLink.querySelector('img');
    }
    // TEXT: title, description
    // Title is inside a link with a span
    let titleHeading = null;
    const titleLink = article.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for heading text, as in example
        titleHeading = document.createElement('strong');
        titleHeading.textContent = titleSpan.textContent;
        // Wrap heading in link for semantic meaning
        const headingLink = document.createElement('a');
        headingLink.href = titleLink.href;
        headingLink.appendChild(titleHeading);
        // Use link-wrapped heading for card
        titleHeading = headingLink;
      }
    }
    // Description
    let descP = null;
    const descSpan = article.querySelector('span.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      descP = document.createElement('p');
      descP.textContent = descSpan.textContent;
    }
    // Compose text cell: heading (link-wrapped strong), then description
    const textCell = [];
    if (titleHeading) textCell.push(titleHeading);
    if (descP) textCell.push(descP);
    // Add row
    tableRows.push([
      imgEl || '',
      textCell.length ? textCell : '',
    ]);
  });
  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
