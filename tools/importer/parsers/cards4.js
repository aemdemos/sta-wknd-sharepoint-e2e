/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image list block containing the cards
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (!imageList) return;

  const cells = [];
  // Table header exactly as in the example
  cells.push(['Cards (cards4)']);

  // For each card in the list
  imageList.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // IMAGE: find the first <img> descendant of the card
    const image = li.querySelector('img');

    // TEXT: compose a div for the text content in the right semantic order
    const textDiv = document.createElement('div');
    // Title (always rendered as strong in the example)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const strong = document.createElement('strong');
      // Use the existing child nodes to preserve any structure
      titleLink.childNodes.forEach((node) => strong.appendChild(node.cloneNode(true)));
      textDiv.appendChild(strong);
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      if (titleLink) textDiv.appendChild(document.createElement('br'));
      textDiv.appendChild(document.createTextNode(desc.textContent.trim()));
    }
    // Fallback if nothing parsed
    if (!textDiv.textContent.trim()) {
      textDiv.textContent = li.textContent.trim();
    }
    // Add row to cells
    cells.push([image, textDiv]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
