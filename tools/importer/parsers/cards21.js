/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row for the block
  const headerRow = ['Cards (cards21)'];
  const rows = [];
  // Select all direct card list items
  const cardItems = element.querySelectorAll('li.cmp-image-list__item');
  cardItems.forEach((cardItem) => {
    // Content is inside article
    const article = cardItem.querySelector('article.cmp-image-list__item-content');
    // Image: find .cmp-image-list__item-image-link > img
    let img = null;
    const imgLink = article && article.querySelector('.cmp-image-list__item-image-link');
    if (imgLink) {
      img = imgLink.querySelector('img');
    }
    // Title: .cmp-image-list__item-title (inside a link)
    let title = '';
    const titleLink = article && article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> as in the markdown example
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        title = strong;
      }
    }
    // Description: .cmp-image-list__item-description
    let description = '';
    const descSpan = article && article.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      description = descSpan.textContent.trim();
    }
    // Build text content cell: title (strong), <br>, description (if present)
    const textCellContent = [];
    if (title) textCellContent.push(title);
    if (title && description) textCellContent.push(document.createElement('br'));
    if (description) textCellContent.push(description);
    // Compose row: [img, textCellContent]
    rows.push([
      img ? img : '',
      textCellContent
    ]);
  });

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(block);
}