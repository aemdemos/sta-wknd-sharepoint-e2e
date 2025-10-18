/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel21)'];

  // Find all carousel items (slides)
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Each slide is a .cmp-carousel__item
  const slides = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Defensive: Find teaser block inside the slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image: Find image inside teaser
    let imgEl = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imgEl = teaserImage;
    }

    // Text cell: Title, Description, CTA
    const textContent = [];
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use a heading element for semantic correctness
      textContent.push(titleEl);
    }
    // Description (div)
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      textContent.push(descEl);
    }
    // CTA (link)
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      textContent.push(ctaEl);
    }

    rows.push([
      imgEl || '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create and replace block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
