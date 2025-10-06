/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all carousel items
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract image from a carousel item
  function getImageFromItem(item) {
    const img = item.querySelector('img');
    return img ? img.cloneNode(true) : null;
  }

  // Helper to extract text content from a carousel item (if any)
  function getTextContentFromItem(item) {
    // Only exclude the image wrapper, include all other content
    const imageDiv = item.querySelector('.image');
    const textNodes = [];
    Array.from(item.childNodes).forEach(child => {
      if (child !== imageDiv && !(child.nodeType === 3 && !child.textContent.trim())) {
        textNodes.push(child.cloneNode(true));
      }
    });
    if (textNodes.length === 0) return '';
    const fragment = document.createDocumentFragment();
    textNodes.forEach(node => fragment.appendChild(node));
    return fragment;
  }

  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot && element.classList.contains('cmp-carousel')) {
    carouselRoot = element;
  }
  if (!carouselRoot) return;

  const items = getCarouselItems(carouselRoot);
  if (!items.length) return;

  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  items.forEach(item => {
    const img = getImageFromItem(item);
    if (!img) return;
    const textContent = getTextContentFromItem(item);
    // Always push two columns: image, text (may be empty string if no text)
    rows.push([img, textContent]);
  });

  // Always ensure all slide rows (after header) have exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
