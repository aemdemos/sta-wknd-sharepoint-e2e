/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards13)'];
  const rows = [];
  // Get all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // Image: use the <img> as-is
    let imageEl = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }
    // Title: get text, wrap in <strong>
    let titleEl = null;
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan && titleSpan.textContent.trim()) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleSpan.textContent.trim();
    }
    // Description: use text in a <div> (even if absent, keep cell structure)
    let descEl = null;
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      descEl = document.createElement('div');
      descEl.textContent = descSpan.textContent.trim();
    }
    // Compose second cell contents
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    rows.push([
      imageEl,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}