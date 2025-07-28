/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row (must match example exactly)
  const headerRow = ['Carousel (carousel22)'];

  // 2. Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // 3. Get all slide items (each .cmp-carousel__item)
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // 4. Prepare rows for each slide
  const rows = slides.map((slide) => {
    // --- IMAGE CELL ---
    let imageElem = null;
    // Find teaser image container and the <img> inside
    const teaserImageContainer = slide.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      imageElem = teaserImageContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    // Gather title (h2), description, CTA
    const textContent = [];
    const contentContainer = slide.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Title (h2 or similar)
      const title = contentContainer.querySelector('.cmp-teaser__title');
      if (title) textContent.push(title);
      // Description (div or p)
      const desc = contentContainer.querySelector('.cmp-teaser__description');
      if (desc) textContent.push(desc);
      // CTA link (at the bottom)
      const cta = contentContainer.querySelector('.cmp-teaser__action-link');
      if (cta) textContent.push(cta);
    }

    // If imageElem missing (shouldn't happen in this block), leave cell empty.
    // If text content missing, leave cell empty.
    return [imageElem, textContent];
  });

  // 5. Compose the final table array
  const cells = [headerRow, ...rows];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
