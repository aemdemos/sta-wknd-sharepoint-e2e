/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-carousel container
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;

  // Get all slide items (immediate children)
  const slideNodes = Array.from(cmpCarousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  const rows = [
    ['Carousel (carousel3)']
  ];

  slideNodes.forEach(slide => {
    // Image (mandatory)
    let imgEl = null;
    // Text content container
    let textContentEls = [];
    
    // Teaser block within slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (teaser) {
      // Image
      const teaserImgDiv = teaser.querySelector('.cmp-teaser__image');
      if (teaserImgDiv) {
        imgEl = teaserImgDiv.querySelector('img');
      }
      // Title - keep heading element as-is
      const titleEl = teaser.querySelector('.cmp-teaser__title');
      if (titleEl) textContentEls.push(titleEl);
      // Description
      const descEl = teaser.querySelector('.cmp-teaser__description');
      if (descEl) textContentEls.push(descEl);
      // CTA
      const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
      if (ctaEl) textContentEls.push(ctaEl);
    }
    // Defensive: image is required, skip this slide if not found
    if (!imgEl) return;

    // For the text cell: if there's only one element, insert as element, else as array
    let textCell = textContentEls.length === 0 ? '' : (textContentEls.length === 1 ? textContentEls[0] : textContentEls);

    rows.push([
      imgEl,
      textCell
    ]);
  });

  // Create the carousel table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
