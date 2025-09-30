/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block requirements
  const headerRow = ['Carousel (carousel19)'];
  const rows = [headerRow];

  // Find carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Each slide is a .cmp-carousel__item
  const slides = content.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    let img = null;
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      const cmpImage = imageDiv.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        img = cmpImage.querySelector('img');
      }
    }
    if (!img) return;

    // Try to extract text content for the slide (title, description, CTA)
    // Look for heading, paragraph, links, etc. in the slide (excluding the image)
    let textContent = '';
    // Get all elements that are not inside the image div
    const textNodes = Array.from(slide.childNodes).filter((node) => {
      return node !== imageDiv && node.nodeType === 1;
    });
    if (textNodes.length > 0) {
      // If there is a heading, paragraph, or link, collect them
      const frag = document.createElement('div');
      textNodes.forEach((node) => {
        frag.appendChild(node.cloneNode(true));
      });
      textContent = frag.innerHTML.trim();
    }
    // Always add two columns: image and text cell (empty if no text)
    rows.push([img, textContent]);
  });

  // Ensure all rows after the header have exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
