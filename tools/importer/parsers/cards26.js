/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards26)'];

  // Get all card items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.classList.contains('cmp-image-list__item'));

  // Prepare table rows
  const rows = [headerRow];

  items.forEach(item => {
    // Content container
    const article = item.querySelector('article.cmp-image-list__item-content');
    if (!article) return;

    // Image (first column)
    let imageCell = null;
    const imageLink = article.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      // Find the actual img element (reference, not clone)
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text (second column)
    let textCellChildren = [];
    const titleLink = article.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCellChildren.push(strong);
    }
    const descriptionSpan = article.querySelector('.cmp-image-list__item-description');
    if (descriptionSpan) {
      // If there is a title, add a <br> to separate
      if (textCellChildren.length > 0) {
        textCellChildren.push(document.createElement('br'));
      }
      textCellChildren.push(descriptionSpan);
    }
    // If neither title nor description, put empty string
    if (textCellChildren.length === 0) textCellChildren = [''];

    rows.push([
      imageCell || '',
      textCellChildren.length === 1 ? textCellChildren[0] : textCellChildren
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
