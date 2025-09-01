/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches exactly
  const headerRow = ['Cards (cards24)'];
  const cells = [headerRow];

  // Get all individual card items
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = Array.from(list.querySelectorAll(':scope > li.cmp-image-list__item'));
  items.forEach((item) => {
    const content = item.querySelector('article.cmp-image-list__item-content');
    if (!content) return;

    // Get image element (reference only, do not clone)
    let imgEl = content.querySelector('.cmp-image-list__item-image img');
    // Get title and description
    const titleLink = content.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = content.querySelector('.cmp-image-list__item-title');
    const descSpan = content.querySelector('.cmp-image-list__item-description');

    // Compose the text cell
    let textElements = [];
    if (titleSpan) {
      // Use strong for heading style, wrap with a link if possible
      let heading = document.createElement('strong');
      heading.textContent = titleSpan.textContent.trim();
      if (titleLink) {
        let link = document.createElement('a');
        link.href = titleLink.getAttribute('href');
        link.appendChild(heading);
        textElements.push(link);
      } else {
        textElements.push(heading);
      }
    }
    if (descSpan) {
      let descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      textElements.push(descDiv);
    }
    // If no title and no description, skip row
    if (!imgEl && textElements.length === 0) return;
    // Add row [image (may be null), text]
    cells.push([
      imgEl,
      textElements.length === 1 ? textElements[0] : textElements
    ]);
  });
  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
