/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image-list block
  const imageList = element.querySelector('.image-list.list .cmp-image-list');
  if (!imageList) return;
  const headerRow = ['Cards (cards4)'];
  const rows = [];
  // Each card is a li in the list
  const items = imageList.querySelectorAll(':scope > li');
  items.forEach((li) => {
    // IMAGE CELL
    let imageEl = li.querySelector('img');

    // TEXT CELL
    const textContent = [];
    // Title (with link if present)
    let titleInserted = false;
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      // Put link with title in a <strong>
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      textContent.push(strong);
      titleInserted = true;
    } else {
      const titleSpan = li.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
        titleInserted = true;
      }
    }
    // Description, if present
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textContent.push(descDiv);
    }
    // Fallback: if no title/description, just use all text
    if (textContent.length === 0) {
      const fallbackText = li.textContent.trim();
      if (fallbackText) textContent.push(document.createTextNode(fallbackText));
    }
    rows.push([
      imageEl,
      textContent.length === 1 ? textContent[0] : textContent
    ]);
  });
  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
