/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row, must match example EXACTLY
  const headerRow = ['Cards (cards27)'];

  // Find the <ul> containing the cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));

  // Build the rows for each card
  const rows = items.map(item => {
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return null;

    // --- First column: the image ---
    let imageCell = '';
    const imgLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      const img = imgLink.querySelector('img');
      if (img) imageCell = img;
    }

    // --- Second column: text: bold/heading title, description ---
    const textCellContent = [];
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('.cmp-image-list__item-title');
      if (span) {
        // Use <strong> for title (matches bold in example)
        const strong = document.createElement('strong');
        strong.textContent = span.textContent;
        textCellContent.push(strong);
        // Add a <br> if there is a description
        const desc = article.querySelector('.cmp-image-list__item-description');
        if (desc && desc.textContent.trim()) {
          textCellContent.push(document.createElement('br'));
        }
      }
    }
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Use a text node for description (no markdown)
      textCellContent.push(document.createTextNode(desc.textContent));
    }

    return [imageCell, textCellContent];
  }).filter(Boolean);

  // Only create the table if there are any rows
  if (rows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...rows
    ], document);
    element.replaceWith(table);
  }
}
