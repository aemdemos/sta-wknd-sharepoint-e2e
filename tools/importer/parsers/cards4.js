/* global WebImporter */
export default function parse(element, { document }) {
  // Find the card container (image-list block)
  const imageList = element.querySelector('.image-list.list, .cmp-image-list');
  if (!imageList) return;
  
  // Select all list items representing cards
  const items = imageList.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;

  // Build the table rows
  const rows = [['Cards (cards4)']]; // Header row exactly as example

  items.forEach((item) => {
    // First column: Image
    let cardImg = null;
    const imageWrap = item.querySelector('.cmp-image-list__item-image');
    if (imageWrap) {
      // Use the first <img> inside this block (if present), referencing not cloning
      cardImg = imageWrap.querySelector('img');
    }

    // Second column: Text content, using <div> to preserve structure
    const textContent = document.createElement('div');
    // Title (as <strong>), not heading, for maximum compatibility
    const title = item.querySelector('.cmp-image-list__item-title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.appendChild(strong);
    }
    // Description, below title if present
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (textContent.childNodes.length) textContent.appendChild(document.createElement('br'));
      textContent.appendChild(document.createTextNode(desc.textContent.trim()));
    }
    // Defensive: if no title/desc, at least an empty text node
    if (!textContent.childNodes.length) {
      textContent.appendChild(document.createTextNode(''));
    }

    // Push row: reference existing elements, keep each cell in its own array
    rows.push([
      cardImg || document.createTextNode(''),
      [textContent]
    ]);
  });

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
