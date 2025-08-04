/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with EXACT text
  const rows = [ [ 'Carousel (carousel9)' ] ];

  // Find the carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  items.forEach(item => {
    // Image cell: get first <img> inside the slide
    let imgCell = '';
    const imgElem = item.querySelector('img');
    if (imgElem) imgCell = imgElem;

    // Text cell: gather all content directly inside the slide that is NOT the image wrapper
    let textCell = '';
    // The image is always inside a div with class 'image'
    const imageDiv = item.querySelector('.image');
    const textFragments = [];
    // Go through all children of the slide item
    Array.from(item.children).forEach(child => {
      if (child !== imageDiv) {
        // If the child is not the image, include it whole
        textFragments.push(child);
      }
    });
    // If nothing is found, textCell remains ''
    if (textFragments.length === 1) {
      textCell = textFragments[0];
    } else if (textFragments.length > 1) {
      textCell = textFragments;
    }
    rows.push([imgCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
