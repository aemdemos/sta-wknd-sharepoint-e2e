/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // 2. Get all carousel item slides
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // 3. Build header row matching example exactly
  const headerRow = ['Carousel (carousel22)'];
  const tableRows = [headerRow];

  // 4. For each slide, extract image and text content
  slides.forEach((slide) => {
    // Find the teaser block inside the slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- Image Cell ---
    let imageCell = '';
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Text Cell ---
    const textParts = [];

    // Title as heading (keep existing heading level from source)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) textParts.push(title);

    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) textParts.push(desc);

    // CTA/action links
    const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      // add all action links
      Array.from(actionContainer.querySelectorAll('a')).forEach(a => textParts.push(a));
    }
    // If no text content, use empty string to preserve the table's 2-column structure
    tableRows.push([
      imageCell,
      textParts.length > 0 ? textParts : ''
    ]);
  });

  // 5. Create and inject the table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
