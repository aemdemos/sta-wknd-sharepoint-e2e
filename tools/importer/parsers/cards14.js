/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly
  const headerRow = ['Cards (cards14)'];
  const rows = [];
  // Get all the card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // IMAGE CELL
    let imageEl = null;
    const imgLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      imageEl = imgLink.querySelector('img');
    }
    // TEXT CELL - Title (bold with link) then description below
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    const descSpan = item.querySelector('span.cmp-image-list__item-description');
    let contentCell;
    if (titleLink && titleSpan) {
      // Build: <strong><a href="...">Title</a></strong> [new line] Description
      // Create a new <a> for the heading, use text from span, link from original
      const a = document.createElement('a');
      a.href = titleLink.href;
      a.textContent = titleSpan.textContent;
      const strong = document.createElement('strong');
      strong.appendChild(a);
      // Place description in a <div> below
      let descDiv = null;
      if (descSpan && descSpan.textContent.trim()) {
        descDiv = document.createElement('div');
        descDiv.textContent = descSpan.textContent;
      }
      contentCell = descDiv ? [strong, descDiv] : [strong];
    } else {
      // fallback: only description
      contentCell = descSpan ? descSpan : '';
    }
    rows.push([
      imageEl,
      contentCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
