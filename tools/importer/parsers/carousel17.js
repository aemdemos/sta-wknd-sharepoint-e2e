/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all carousel items and build rows
  function getCarouselRows(carouselContent) {
    const rows = [];
    // Find all direct children with class 'cmp-carousel__item'
    const items = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');
    items.forEach((item) => {
      // Find image element (mandatory)
      let imgEl = item.querySelector('.cmp-image__image');
      if (!imgEl) {
        // Defensive: fallback to any img inside item
        imgEl = item.querySelector('img');
      }
      let imageCell = imgEl ? imgEl : document.createTextNode('');

      // Find text content (optional)
      let textCell = '';
      // Try to find all text content inside the item except the image
      // This will get headings, paragraphs, and any other text nodes
      const textNodes = [];
      // Exclude image containers
      item.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Exclude image wrappers
          if (!node.classList.contains('image') && !node.classList.contains('cmp-image')) {
            textNodes.push(node.cloneNode(true));
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.trim()) {
            textNodes.push(document.createTextNode(node.textContent));
          }
        }
      });
      // If no text found, fallback to meta caption or alt
      if (textNodes.length === 0) {
        const metaCaption = item.querySelector('meta[itemprop="caption"]');
        if (metaCaption && metaCaption.content) {
          const p = document.createElement('p');
          p.textContent = metaCaption.content;
          textNodes.push(p);
        } else if (imgEl && imgEl.getAttribute('alt')) {
          const p = document.createElement('p');
          p.textContent = imgEl.getAttribute('alt');
          textNodes.push(p);
        }
      }
      if (textNodes.length > 0) {
        textCell = textNodes;
      }
      rows.push([imageCell, textCell]);
    });
    return rows;
  }

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Build table rows
  const headerRow = ['Carousel (carousel17)'];
  const slideRows = getCarouselRows(carouselContent);
  const cells = [headerRow, ...slideRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
