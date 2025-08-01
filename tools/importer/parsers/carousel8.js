/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements (exactly one column)
  const rows = [['Carousel (carousel8)']];

  // Find carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Process each slide
  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // IMAGE CELL: Find .cmp-image inside .image, or fallback to first <img>
    let imageCell = null;
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      const cmpImage = imageContainer.querySelector('.cmp-image');
      if (cmpImage) {
        imageCell = cmpImage;
      } else {
        const img = imageContainer.querySelector('img');
        imageCell = img || imageContainer;
      }
    } else {
      imageCell = item.querySelector('img');
    }

    // TEXT CELL: All children that are NOT .image
    let textElements = [];
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textElements.push(child);
      }
    });
    // Also get any direct text nodes (not only elements)
    Array.from(item.childNodes).forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) {
        // Wrap in <p> to preserve structure
        const p = document.createElement('p');
        p.textContent = n.textContent.trim();
        textElements.push(p);
      }
    });
    // If there is no text content at all, use an empty string so cell is not 'undefined'
    let textCell = textElements.length ? (textElements.length === 1 ? textElements[0] : textElements) : '';

    // 2 columns: image | text
    rows.push([imageCell, textCell]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
