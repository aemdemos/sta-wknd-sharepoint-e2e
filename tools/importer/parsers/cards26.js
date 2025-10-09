/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards26) block: extract cards from the image-list structure
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find the UL containing the card items
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');

  items.forEach((item) => {
    // Each card's content is inside article.cmp-image-list__item-content
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // --- IMAGE CELL ---
    // Find the image link and image element
    let imgCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the img inside the image link
      const img = imageLink.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }

    // --- TEXT CELL ---
    const textCellContent = [];

    // Title (as heading, wrapped in link if available)
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = article.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Create heading element
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent.trim();
      if (titleLink && titleLink.href) {
        const link = document.createElement('a');
        link.href = titleLink.href;
        link.textContent = heading.textContent;
        heading.textContent = '';
        heading.appendChild(link);
      }
      textCellContent.push(heading);
    }

    // Description
    const descSpan = article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      const desc = document.createElement('p');
      desc.textContent = descSpan.textContent.trim();
      textCellContent.push(desc);
    }

    // No explicit CTA in source, but if present, would be added here

    rows.push([imgCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
