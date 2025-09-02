/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Carousel (carousel18)'];

  // Get carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Slides container
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;
  // Get all slides
  const slides = Array.from(slidesContainer.querySelectorAll('.cmp-carousel__item'));

  // For each slide, extract image and all text content (recursively)
  const rows = slides.map(slide => {
    // Image: always first image inside .image
    const imgWrapper = slide.querySelector('.image');
    let img = '';
    if (imgWrapper) {
      const slideImg = imgWrapper.querySelector('img');
      if (slideImg) img = slideImg;
    }
    // Recursively get all text content (excluding .image)
    function collectTextContent(node) {
      let results = [];
      node.childNodes.forEach(child => {
        if (child.nodeType === 1) { // Element
          if (!child.classList.contains('image')) {
            results.push(child);
          }
        } else if (child.nodeType === 3 && child.textContent.trim()) { // Text node
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          results.push(p);
        }
      });
      // Now check children recursively for deeply nested text
      node.querySelectorAll && node.querySelectorAll(':scope > *:not(.image)').forEach(el => {
        results = results.concat(collectTextContent(el));
      });
      return results;
    }
    // Get all non-image text content, deeply
    let textContent = collectTextContent(slide);
    // Remove duplicates (by reference)
    textContent = Array.from(new Set(textContent));
    // Format cell
    let textCell = textContent.length === 1 ? textContent[0] : (textContent.length > 1 ? textContent : '');
    if (textContent.length === 0) textCell = '';
    return [img, textCell];
  });

  // Final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
