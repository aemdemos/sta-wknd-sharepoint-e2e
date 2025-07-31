/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 2. Find all slides within the carousel
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // 3. Prepare the table rows
  const cells = [ ['Carousel (carousel17)'] ];

  slides.forEach(slide => {
    // --- First cell: the image, extracted from the slide
    let img = slide.querySelector('img');
    let imgCell = img || '';
    
    // --- Second cell: any text content (title, description, etc)
    // Robustly find text content: collect all children that are NOT image wrappers
    let textNodes = [];
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textNodes.push(child);
      }
    });
    // In this variant, there is no text, so we check for text within .image after <img>
    if (textNodes.length === 0) {
      const imageWrappers = slide.querySelectorAll('.image');
      imageWrappers.forEach(wrapper => {
        let foundImg = false;
        Array.from(wrapper.childNodes).forEach(node => {
          if (node.nodeType === 1 && node.tagName.toLowerCase() === 'img') {
            foundImg = true;
            return;
          }
          if (foundImg && (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))) {
            textNodes.push(node);
          }
        });
      });
    }
    // Clean up empty nodes
    textNodes = textNodes.filter(n => {
      if (typeof n === 'string') return n.trim();
      if (n.nodeType === 3) return n.textContent.trim();
      if (n.nodeType === 1) return true;
      return false;
    });
    const textCell = textNodes.length > 0 ? textNodes : '';
    
    cells.push([imgCell, textCell]);
  });

  // 4. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
