/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by block spec
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Find the carousel content root
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Each slide is a .cmp-carousel__item
  const slides = carouselContent.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // Find the image (always in .image > [data-cmp-is=image] > img)
    let img = null;
    const imageWrapper = slide.querySelector('.image [data-cmp-is="image"]');
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
    }
    const imgCell = img ? img : '';

    // Try to find text content in the slide
    // Look for headings, paragraphs, and links inside the slide (but outside the image)
    let textCell = '';
    const textFragments = [];
    slide.childNodes.forEach((node) => {
      if (node.nodeType === 1 && !node.classList.contains('image')) {
        // Collect all direct children that are not part of the image
        // If the node itself is a heading, paragraph, or link, add it
        if (/^H[1-6]$/.test(node.tagName) || node.tagName === 'P' || node.tagName === 'A') {
          textFragments.push(node.cloneNode(true));
        }
        // Also collect any such elements inside this node
        node.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a').forEach(el => {
          textFragments.push(el.cloneNode(true));
        });
      }
    });
    if (textFragments.length) {
      const textDiv = document.createElement('div');
      textFragments.forEach(frag => textDiv.appendChild(frag));
      textCell = textDiv;
      rows.push([imgCell, textCell]);
    } else {
      rows.push([imgCell]); // Only one cell if no text content
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
