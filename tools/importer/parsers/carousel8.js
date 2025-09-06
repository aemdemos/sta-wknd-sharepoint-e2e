/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row as required
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // For each slide, create a row: [image, textContent (empty if none)]
  items.forEach((item) => {
    // Find image element
    let imgEl = null;
    const imageContainer = item.querySelector('.image');
    if (imageContainer) {
      // Find the actual <img> inside
      imgEl = imageContainer.querySelector('img');
    }
    // Defensive: if no image, skip this slide
    if (!imgEl) return;

    // Try to find text content in the slide (any heading, paragraph, or link)
    // We'll look for any direct children that are not the image container
    let textCell = '';
    const textNodes = Array.from(item.children).filter(child => !child.classList.contains('image'));
    if (textNodes.length > 0) {
      const frag = document.createElement('div');
      textNodes.forEach(node => frag.appendChild(node.cloneNode(true)));
      textCell = frag;
    } else {
      textCell = '';
    }
    // Always push two columns: image and text (empty if none)
    rows.push([imgEl, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
