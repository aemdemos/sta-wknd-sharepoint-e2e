/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards8)'];

  // Find all card items
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  const rows = [];

  items.forEach((item) => {
    // Defensive: Find the content container
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // Image: Find the img element inside the image link
    let img = content.querySelector('.cmp-image-list__item-image-link img');
    // Defensive: fallback if not found
    if (!img) {
      img = content.querySelector('img');
    }

    // Title: Find the span with the title
    let titleSpan = content.querySelector('.cmp-image-list__item-title');
    let titleText = titleSpan ? titleSpan.textContent.trim() : '';

    // Description: Find the span with the description
    let descSpan = content.querySelector('.cmp-image-list__item-description');
    let descText = descSpan ? descSpan.textContent.trim() : '';

    // Compose the text cell
    const textCell = document.createElement('div');
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.appendChild(heading);
    }
    if (descText) {
      const para = document.createElement('div');
      para.textContent = descText;
      textCell.appendChild(para);
    }

    // Add the row: [image, text]
    rows.push([
      img,
      textCell
    ]);
  });

  // Compose the table
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace element
  element.replaceWith(block);
}
