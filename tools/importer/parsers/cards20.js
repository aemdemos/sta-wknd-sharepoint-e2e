/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: 2 columns, multiple rows, each row = [image, text]
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find the parent container holding all card items
  const imageList = element.querySelector('.image-list.list');
  if (!imageList) return;

  // Find all card items
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  items.forEach((item) => {
    // Card content container
    const content = item.querySelector('.cmp-image-list__item-content');
    if (!content) return;

    // --- IMAGE CELL ---
    // Get the image element (inside a link)
    let imageCell = null;
    const imageLink = content.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
    // Defensive: If no image found, use null
    if (!imageCell) imageCell = '';

    // --- TEXT CELL ---
    // Title (inside a link)
    let title = content.querySelector('.cmp-image-list__item-title');
    // Defensive: If no title, fallback to alt text
    if (!title) {
      const img = content.querySelector('img');
      if (img && img.alt) {
        title = document.createElement('strong');
        title.textContent = img.alt;
      }
    }
    // Make title a heading (h3)
    let heading = null;
    if (title && title.textContent) {
      heading = document.createElement('h3');
      heading.textContent = title.textContent;
    }

    // Description
    let description = content.querySelector('.cmp-image-list__item-description');
    // Defensive: If no description, use empty string
    let descElem = null;
    if (description && description.textContent) {
      descElem = document.createElement('p');
      descElem.textContent = description.textContent.trim();
    }

    // Compose text cell: heading + description
    const textCellContent = [];
    if (heading) textCellContent.push(heading);
    if (descElem) textCellContent.push(descElem);

    // Add card row: [image, text]
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
