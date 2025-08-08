/* global WebImporter */
export default function parse(element, { document }) {
  // Helper function to collect text content cell from teaser content
  function extractTextCell(teaserContent) {
    if (!teaserContent) return '';
    const contentPieces = [];
    // Title (as heading, usually h2)
    const title = Array.from(teaserContent.children).find(child => child.classList.contains('cmp-teaser__title'));
    if (title) contentPieces.push(title);
    // Description (possibly <div> or <div><p>...</p></div>)
    const desc = Array.from(teaserContent.children).find(child => child.classList.contains('cmp-teaser__description'));
    if (desc) {
      // If the description only contains a <p>, extract the <p> element for semantic clarity
      if (desc.children.length === 1 && desc.children[0].tagName === 'P') {
        contentPieces.push(desc.children[0]);
      } else {
        contentPieces.push(desc);
      }
    }
    // CTA button (link)
    const ctaContainer = Array.from(teaserContent.children).find(child => child.classList.contains('cmp-teaser__action-container'));
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentPieces.push(ctaLink);
    }
    return contentPieces.length > 0 ? contentPieces : '';
  }

  // Get the carousel element (could be wrapper or direct)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  // Get all carousel item slides
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));
  const cells = [];
  // Header row: exactly matches example
  cells.push(['Carousel (carousel22)']);
  slides.forEach((slide) => {
    // Find teaser (should exist in each slide)
    const teaser = slide.querySelector('.cmp-teaser');
    let imgEl = null;
    // Image: look for img in .cmp-teaser__image
    if (teaser) {
      const teaserImg = teaser.querySelector('.cmp-teaser__image img');
      if (teaserImg) imgEl = teaserImg;
    }
    // Text content cell: from .cmp-teaser__content
    let textCell = '';
    if (teaser) {
      const teaserContent = teaser.querySelector('.cmp-teaser__content');
      textCell = extractTextCell(teaserContent);
    }
    cells.push([
      imgEl,
      textCell
    ]);
  });

  // Create and replace element with table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
