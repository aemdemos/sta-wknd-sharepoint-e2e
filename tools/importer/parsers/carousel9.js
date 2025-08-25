/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const cells = [['Carousel (carousel9)']];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Extract each carousel slide (item)
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  slides.forEach((slide) => {
    // IMAGE CELL: get the first .cmp-image in the slide (reference the element directly)
    let imageCell = '';
    const cmpImage = slide.querySelector('.cmp-image');
    if (cmpImage) {
      imageCell = cmpImage;
    } else {
      const img = slide.querySelector('img');
      if (img) imageCell = img;
    }

    // TEXT CELL: Gather all text content not part of the image block, including overlays inside image containers
    let textCell = '';
    const textNodes = [];
    
    // 1. First, collect children of the slide that are not the image container
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        textNodes.push(child);
      }
    });

    // 2. Also include any text (headings, paragraphs, links, etc) found *inside* the image container but outside of .cmp-image
    const imageDiv = slide.querySelector('.image');
    if (imageDiv) {
      Array.from(imageDiv.children).forEach(child => {
        if (!child.classList.contains('cmp-image')) {
          textNodes.push(child);
        }
      });
    }

    // 3. Fallback: if still no text, search deeply for any heading, p, or a tags not inside .cmp-image
    if (!textNodes.length) {
      slide.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach(el => {
        if (!el.closest('.cmp-image')) textNodes.push(el);
      });
    }

    // 4. Assign textCell if any found
    if (textNodes.length === 1) textCell = textNodes[0];
    else if (textNodes.length > 1) textCell = textNodes;
    // else remains ''

    // Add slide row
    cells.push([imageCell, textCell]);
  });

  // Build table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
