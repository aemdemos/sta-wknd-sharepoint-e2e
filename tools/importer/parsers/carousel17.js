/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the main content area
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Collect all slide elements
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  const cells = [
    ['Carousel (carousel17)']
  ];

  slides.forEach((slide) => {
    // 1. Find the image: the first img descendant
    const imgEl = slide.querySelector('img');
    if (!imgEl) return; // image is required

    // 2. Gather all slide content except image wrappers
    // We'll collect all children of the slide that are not image wrappers and contain some text or elements
    // But in the provided HTML, all non-image content is inside the slide's element except for the image wrapper itself

    // Find all direct children of the slide that are not the image wrapper
    const nonImageChildren = Array.from(slide.children).filter(child => {
      // Keep anything that is not the image wrapper (class 'image' or contains an img)
      if (child.classList.contains('image')) return false;
      if (child.querySelector('img')) return false;
      return true;
    });

    // If there is non-image content, aggregate it into one fragment
    let textCell = null;
    if (nonImageChildren.length > 0) {
      // Put all contents into a single div (structurally only for content grouping, not for display)
      const fragment = document.createElement('div');
      nonImageChildren.forEach(child => {
        fragment.appendChild(child);
      });
      // If the div only has one element, use that element directly
      textCell = fragment.childNodes.length === 1 ? fragment.firstChild : fragment;
      // Remove empty containers (if there's no real content)
      const hasContent = textCell && (textCell.textContent && textCell.textContent.trim().length > 0);
      if (!hasContent) textCell = null;
    }

    // Always build the row with 1 or 2 cells
    cells.push(textCell ? [imgEl, textCell] : [imgEl]);
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
