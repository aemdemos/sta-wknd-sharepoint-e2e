/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Table header row from markdown example
  const cells = [ ['Carousel (carousel22)'] ];

  items.forEach(item => {
    // 1st column: image (mandatory)
    let img = null;
    const teaserImage = item.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const cmpImage = teaserImage.querySelector('.cmp-image');
      if (cmpImage) {
        img = cmpImage.querySelector('img');
      }
    }

    // 2nd column: text content (optional)
    const textEls = [];
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Heading (h2)
      const heading = teaserContent.querySelector('.cmp-teaser__title');
      if (heading) textEls.push(heading);
      // Description
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // Retain all inner HTML, including <p>
        textEls.push(desc);
      }
      // CTA link (button or link)
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const cta = ctaContainer.querySelector('.cmp-teaser__action-link');
        if (cta) textEls.push(cta);
      }
    }
    // If no text content, use empty string
    const textCell = textEls.length ? textEls : '';

    // Only push row if image exists
    if (img) {
      cells.push([img, textCell]);
    }
  });

  // Create and replace with the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
