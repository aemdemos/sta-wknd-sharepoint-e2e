/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items
  function getCarouselItems(root) {
    const content = root.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  // Helper to extract the first image in a carousel item
  function getImageFromItem(item) {
    return item.querySelector('img');
  }

  // Helper to check for visible text content
  function hasVisibleText(item) {
    return !!item.querySelector('h1, h2, h3, h4, h5, h6, p, a');
  }

  // Always use the target block name as the header row
  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  // Find the carousel root (may be the element itself or a child)
  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot && element.classList.contains('cmp-carousel')) {
    carouselRoot = element;
  }
  if (!carouselRoot) return;

  const items = getCarouselItems(carouselRoot);
  items.forEach(item => {
    const img = getImageFromItem(item);
    if (!img) return;
    if (hasVisibleText(item)) {
      // Collect all visible text elements
      const textEls = [];
      item.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach(el => {
        textEls.push(el.cloneNode(true));
      });
      rows.push([img, textEls]);
    } else {
      // Only image, single column per row
      rows.push([img]);
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
