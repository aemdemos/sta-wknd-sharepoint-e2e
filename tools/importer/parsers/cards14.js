/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards14)'];
  const rows = [];

  // Get the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Extract image element (reference the <img> only)
    let imageEl = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // Extract title (textContent), wrap in <strong> (to match bold in example)
    let titleNode = null;
    const titleEl = article.querySelector('.cmp-image-list__item-title');
    if (titleEl && titleEl.textContent.trim()) {
      titleNode = document.createElement('strong');
      titleNode.textContent = titleEl.textContent.trim();
    }

    // Extract description (textContent), wrap in <p>
    let descNode = null;
    const descEl = article.querySelector('.cmp-image-list__item-description');
    if (descEl && descEl.textContent.trim()) {
      descNode = document.createElement('p');
      descNode.textContent = descEl.textContent.trim();
    }

    // Compose the text cell content (title bold, description in <p>)
    const textCellContents = [];
    if (titleNode) textCellContents.push(titleNode);
    if (descNode) textCellContents.push(descNode);

    // Assemble the row for the table: [image, text content]
    rows.push([imageEl, textCellContents]);
  });

  // Compose the table for the block
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(block);
}
