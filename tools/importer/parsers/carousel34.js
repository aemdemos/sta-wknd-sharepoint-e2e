/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Header row matches the example exactly
  const cells = [['Carousel (carousel34)']];

  slides.forEach((slide) => {
    // Image cell (first column)
    let image = '';
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      const cmpImage = imageDiv.querySelector('.cmp-image');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) image = img;
      }
    }

    // Text cell (second column): collect all content in the slide except .image
    let textContent = '';
    const textParts = [];
    Array.from(slide.childNodes).forEach(child => {
      // Exclude image divs and also filter out empty text nodes
      if (!(child.nodeType === 1 && child.classList && child.classList.contains('image'))) {
        if (
          (child.nodeType === 3 && child.textContent.trim()) || // non-empty text node
          (child.nodeType === 1 && child.textContent.trim())     // non-empty element
        ) {
          textParts.push(child);
        }
      }
    });
    // If there is text content, include it, otherwise leave cell empty
    if (textParts.length === 1) {
      textContent = textParts[0];
    } else if (textParts.length > 1) {
      const frag = document.createDocumentFragment();
      textParts.forEach(e => frag.appendChild(e));
      textContent = frag;
    }
    // Always push both cells (image, text)
    cells.push([image, textContent]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
