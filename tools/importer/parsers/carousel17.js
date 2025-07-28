/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match the example format exactly
  const headerRow = ['Carousel (carousel17)'];
  const cells = [headerRow];

  // Find the carousel's content area
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // For each carousel item (slide)
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  items.forEach(item => {
    // First cell: the image element (the <img> directly)
    const imageEl = item.querySelector('img');
    
    // Second cell: all text content except the image itself
    let textCell = '';
    // Collect all nodes that are not the main image container
    let textNodes = [];
    // The .image element is always the image container
    const imageDiv = item.querySelector('.image');
    // Add all siblings after .image (if any), or if .image is missing, all children
    if (imageDiv) {
      let sibling = imageDiv.nextSibling;
      while (sibling) {
        // If it's not just whitespace
        if (!(sibling.nodeType === Node.TEXT_NODE && !sibling.textContent.trim())) {
          textNodes.push(sibling);
        }
        sibling = sibling.nextSibling;
      }
    } else {
      // Fallback: No image container, take all children that aren't <img>
      item.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'img') return;
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        textNodes.push(node);
      });
    }
    // Remove whitespace-only nodes
    textNodes = textNodes.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) return !!node.textContent.trim();
      return true;
    });
    if (textNodes.length === 1) {
      textCell = textNodes[0];
    } else if (textNodes.length > 1) {
      textCell = textNodes;
    } else {
      // If no explicit text content, fallback on image alt/title as a heading
      if (imageEl) {
        const imageAlt = imageEl.getAttribute('alt') || '';
        const imageTitle = imageEl.getAttribute('title') || '';
        // Prefer title, fallback to alt
        const heading = imageTitle || imageAlt;
        if (heading) {
          const h2 = document.createElement('h2');
          h2.textContent = heading;
          textCell = h2;
        }
      }
    }
    cells.push([imageEl || '', textCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Ensure header row spans two columns for correct structure
  const headerTh = table.querySelector('tr:first-child th');
  if (headerTh && table.rows[1] && table.rows[1].cells.length > 1) {
    headerTh.setAttribute('colspan', table.rows[1].cells.length);
  }
  element.replaceWith(table);
}
