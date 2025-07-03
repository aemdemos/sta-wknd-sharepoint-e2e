/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header exactly as in the example -- single cell row
  const rows = [['Carousel (carousel22)']];

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the slides container
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;

  // Each slide is a direct child with the .cmp-carousel__item class
  const slides = slidesContainer.querySelectorAll(':scope > .cmp-carousel__item');

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imageElem = null;
    const teaserImage = slide.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const img = teaserImage.querySelector('img');
      if (img) imageElem = img;
    }

    // --- TEXT CELL ---
    let textElems = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Heading (any h1-h6)
      const heading = teaserContent.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textElems.push(heading);
      // Description
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) textElems.push(desc);
      // Call-to-action(s)
      const actionsContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionsContainer) {
        const ctas = Array.from(actionsContainer.querySelectorAll('a'));
        if (ctas.length) textElems = textElems.concat(ctas);
      }
    }
    if (textElems.length === 0) {
      const fallbackDesc = slide.querySelector('.cmp-teaser__description');
      if (fallbackDesc) textElems.push(fallbackDesc);
    }
    let textCell = textElems.length === 0 ? '' : (textElems.length === 1 ? textElems[0] : textElems);

    // Each slide row must have two columns, so push as [imageElem, textCell]
    rows.push([imageElem, textCell]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
