/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Table header as per block guidelines
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // Always use 2 columns for slides (image, text)
  items.forEach((item) => {
    // Find the image (mandatory)
    const img = item.querySelector('img');
    if (!img) return; // skip if no image

    // Try to find text content (optional)
    const itemClone = item.cloneNode(true);
    Array.from(itemClone.querySelectorAll('.image, img')).forEach(el => el.remove());
    let textContent = '';
    // If there are any element children left, use them. Otherwise, use trimmed text.
    const elementChildren = Array.from(itemClone.childNodes).filter(n => n.nodeType === 1);
    if (elementChildren.length) {
      textContent = elementChildren;
    } else if (itemClone.textContent && itemClone.textContent.trim().length > 0) {
      textContent = itemClone.textContent.trim();
    } else {
      textContent = '';
    }
    // Always push two columns per row, even if textContent is empty
    rows.push([img, textContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
