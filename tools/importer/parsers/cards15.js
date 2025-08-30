/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block spec
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all 'li' items representing cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  items.forEach((item) => {
    // Get image (reference the actual <img> element)
    const img = item.querySelector('.cmp-image-list__item-image img');
    // If the image is wrapped in a link, let's use the img only (as in the markdown structure)

    // Construct the text cell
    const textContainer = document.createElement('div');

    // Title (always present, inside link)
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Bold title, optionally link
      if (titleLink && titleLink.getAttribute('href')) {
        const titleA = document.createElement('a');
        titleA.href = titleLink.getAttribute('href');
        // Bold inside link
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = titleSpan.textContent;
        titleA.appendChild(titleStrong);
        textContainer.appendChild(titleA);
      } else {
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = titleSpan.textContent;
        textContainer.appendChild(titleStrong);
      }
    }
    // Description (optional)
    const descSpan = item.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent;
      textContainer.appendChild(descDiv);
    }
    // Only push the row if image and text exist (matches the spec of the block)
    if (img && textContainer.childNodes.length > 0) {
      rows.push([img, textContainer]);
    }
  });

  // Only create if there is at least a header and one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
