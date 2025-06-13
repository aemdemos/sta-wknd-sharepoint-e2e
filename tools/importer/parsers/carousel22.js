/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root (should contain slides)
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const slidesWrapper = carouselRoot.querySelector('.cmp-carousel__content');
  if (!slidesWrapper) return;
  // Get all slide elements
  const slides = Array.from(slidesWrapper.querySelectorAll(':scope > .cmp-carousel__item'));
  // Prepare table structure: first row is header, then one row per slide
  const cells = [ ['Carousel (carousel22)'] ];
  slides.forEach(slide => {
    // Extract image (first cell)
    let imageCell = '';
    const imageContainer = slide.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const cmpImage = imageContainer.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Extract text content (second cell)
    let infoCell = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (keep as heading)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) infoCell.push(title);
      // Description
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) infoCell.push(desc);
      // CTA (link)
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        // Only include the CTA link if it exists and has content
        const ctaLink = actionContainer.querySelector('a');
        if (ctaLink) infoCell.push(ctaLink);
      }
    }
    // If infoCell is empty, use empty string
    if (!infoCell.length) infoCell = '';
    // Add this slide as a row
    cells.push([imageCell, infoCell]);
  });
  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original carousel element with the table
  element.replaceWith(table);
}
