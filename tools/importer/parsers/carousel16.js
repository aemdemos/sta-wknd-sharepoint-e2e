/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root (the one with class 'cmp-carousel')
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the carousel content wrapper
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items (divs with class 'cmp-carousel__item')
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel16)'];
  rows.push(headerRow);

  // For each slide
  items.forEach((item) => {
    // Find the image element inside the slide
    let img = item.querySelector('img');
    if (!img) return;

    // Find text content: get all direct children except the image
    let textCell = '';
    // We'll collect all non-image direct children of the slide
    const slideChildren = Array.from(item.children);
    const textFragments = [];
    slideChildren.forEach((child) => {
      // If child contains the image, skip
      if (child.querySelector('img')) return;
      // If child is not the image container, collect its text content
      // Also collect any text nodes directly under the slide
      if (child.textContent.trim()) {
        textFragments.push(child.cloneNode(true));
      }
    });
    // If nothing found, try to get alt text from image
    if (textFragments.length === 0 && img.alt) {
      const p = document.createElement('p');
      p.textContent = img.alt;
      textFragments.push(p);
    }
    if (textFragments.length > 0) {
      const frag = document.createDocumentFragment();
      textFragments.forEach((node) => frag.appendChild(node));
      textCell = frag;
    }

    rows.push([img, textCell || '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
