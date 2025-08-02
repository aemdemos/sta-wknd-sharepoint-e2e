/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header for the Cards (cards25) block, per requirements
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Select all card list items in the block
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((li) => {
    const article = li.querySelector('article.cmp-image-list__item-content');
    if (!article) return;
    // First column: image element
    let imageCell = '';
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) imageCell = img;
    }
    // Second column: text content (title as <strong> and description below)
    const contentFragments = [];
    // Title
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        contentFragments.push(strong);
      }
    }
    // Description
    const desc = article.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim().length > 0) {
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      contentFragments.push(descDiv);
    }
    // If no title or description, cell should be blank
    rows.push([
      imageCell,
      contentFragments.length ? contentFragments : ''
    ]);
  });

  // Create and replace with Cards table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
