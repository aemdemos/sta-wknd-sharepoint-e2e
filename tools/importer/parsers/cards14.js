/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];
  // Each card is a li element
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: use the <img> element directly
    const img = item.querySelector('img');

    // Title: use the <span> inside the title link
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    let titleEl = null;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for the heading, as in the markdown example
        titleEl = document.createElement('strong');
        titleEl.textContent = titleSpan.textContent;
      }
    }

    // Description: use the <span> as plain text, after a <br>
    const descSpan = item.querySelector('span.cmp-image-list__item-description');
    let cell2Content = [];
    if (titleEl) {
      cell2Content.push(titleEl);
    }
    if (descSpan && descSpan.textContent.trim()) {
      if (titleEl) {
        cell2Content.push(document.createElement('br'));
      }
      // Use a text node for the description
      cell2Content.push(descSpan.textContent);
    }
    rows.push([img, cell2Content]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
