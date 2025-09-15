/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  // Table header row
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Each card is a <li> with an <article>
  const items = list.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Find the article containing card content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- Image cell ---
    // Find the image link and image element
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    let imageCell = null;
    if (imageLink) {
      // Use the image link as the cell (contains image inside)
      imageCell = imageLink;
    } else {
      // Fallback: try to find an image
      const img = article.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Text cell ---
    // Title link and title span
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');

    // Compose text cell content
    const textCellContent = [];
    if (titleLink && titleSpan) {
      // Wrap title in <strong> for heading style
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      // Make the title clickable if link exists
      if (titleLink.getAttribute('href')) {
        const link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(strong);
        textCellContent.push(link);
      } else {
        textCellContent.push(strong);
      }
    }
    if (descSpan) {
      // Add description below title
      const desc = document.createElement('div');
      desc.textContent = descSpan.textContent;
      textCellContent.push(desc);
    }

    // Add row: [image, text]
    rows.push([
      imageCell,
      textCellContent,
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
