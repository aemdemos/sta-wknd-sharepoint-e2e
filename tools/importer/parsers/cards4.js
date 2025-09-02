/* global WebImporter */
export default function parse(element, { document }) {
  // Safely find the image-list block
  const imageListBlock = element.querySelector('.image-list.list ul.cmp-image-list');
  if (!imageListBlock) return;

  // Get all card items
  const cardItems = Array.from(imageListBlock.querySelectorAll('li.cmp-image-list__item'));

  // Prepare the header row as specified
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  cardItems.forEach((li) => {
    // Find the first image from each card
    const img = li.querySelector('img');
    // Find the title and description
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    const descriptionSpan = li.querySelector('.cmp-image-list__item-description');

    // Title: bold, as in example (using <strong>)
    let titleElem;
    if (titleSpan && titleSpan.textContent.trim()) {
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent.trim();
    }

    // Description as paragraph (if exists)
    let descElem;
    if (descriptionSpan && descriptionSpan.textContent.trim()) {
      descElem = document.createElement('p');
      descElem.textContent = descriptionSpan.textContent.trim();
    }

    // Compose right cell content: title then description
    const textCell = [];
    if (titleElem) textCell.push(titleElem);
    if (descElem) textCell.push(descElem);

    // Only include an image if it exists
    const imgCell = img ? img : '';

    cells.push([
      imgCell,
      textCell.length ? textCell : ''
    ]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the image-list block with the new block table
  imageListBlock.parentNode.replaceChild(blockTable, imageListBlock);
}
