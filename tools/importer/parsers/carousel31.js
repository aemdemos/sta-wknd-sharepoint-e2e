/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table with the correct header row
  const table = [['Carousel (carousel31)']];

  // Find the carousel element that actually contains the slides
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) {
    // No slides found; fallback: create single empty row
    table.push(['', '']);
  } else {
    const slides = Array.from(content.children).filter(
      (child) => child.classList.contains('cmp-carousel__item')
    );
    slides.forEach((slide) => {
      // --- IMAGE CELL ---
      // Find first cmp-image element or fallback to first <img>
      let imgCell = null;
      const cmpImg = slide.querySelector('.cmp-image');
      if (cmpImg) {
        imgCell = cmpImg;
      } else {
        const img = slide.querySelector('img');
        if (img) imgCell = img;
      }
      // --- TEXT CELL ---
      // Gather any non-image text content
      // We'll include any content in the slide that is not a descendant of the cmp-image wrapper
      let textCell = '';
      // Make a set of all image wrapper elements to exclude
      const imgWrappers = [cmpImg];
      // Get all direct children of the slide that are not image wrappers
      const textNodes = [];
      slide.childNodes.forEach((node) => {
        if (node.nodeType === 3) { // text node
          if (node.textContent.trim()) {
            // Wrap in a <p> to preserve in DOM
            const p = document.createElement('p');
            p.textContent = node.textContent;
            textNodes.push(p);
          }
        } else if (node.nodeType === 1) { // element node
          // If not the cmp-image wrapper, nor containing the image
          if (!node.classList.contains('image') && !node.classList.contains('cmp-image')) {
            textNodes.push(node);
          }
        }
      });
      if (textNodes.length > 0) {
        textCell = textNodes.length === 1 ? textNodes[0] : textNodes;
      }
      table.push([imgCell, textCell]);
    });
  }
  // Replace the element with the carousel block
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
