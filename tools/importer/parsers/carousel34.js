/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;

  // Find the container with all slides
  const content = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  const rows = [['Carousel (carousel34)']]; // Header row EXACT match

  slides.forEach(slide => {
    // --- IMAGE CELL ---
    // Find the first <img> in the slide
    const imageEl = slide.querySelector('img');
    
    // --- TEXT CELL ---
    // Any content not containing the image is considered for the text cell
    // We'll collect all non-image direct children (or their children if needed)
    let textCell = '';
    const slideChildren = Array.from(slide.children);
    let textBlocks = [];
    slideChildren.forEach(child => {
      // If this child does not contain the image, and is not empty
      if (!child.querySelector('img') && child.textContent.trim()) {
        // If it has children, add those, else add the child itself
        if (child.children.length > 0) {
          textBlocks.push(...Array.from(child.children));
        } else {
          textBlocks.push(child);
        }
      }
    });
    // Fallback: if no text blocks but the image has alt/title, use that as a <p>
    if (textBlocks.length === 0 && imageEl) {
      const fallback = imageEl.getAttribute('title') || imageEl.getAttribute('alt');
      if (fallback) {
        const p = document.createElement('p');
        p.textContent = fallback;
        textBlocks.push(p);
      }
    }
    if (textBlocks.length > 1) {
      textCell = textBlocks;
    } else if (textBlocks.length === 1) {
      textCell = textBlocks[0];
    }
    // Always create two columns (image, text)
    if (imageEl) {
      rows.push([imageEl, textCell || '']);
    }
  });
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
