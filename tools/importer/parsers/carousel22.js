/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container (may be the element itself or a child)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  // Get all carousel items/slides
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));

  // Build the table cells: header, then one row per slide
  const cells = [];
  cells.push(['Carousel (carousel22)']); // Header matches the example

  slides.forEach((slide) => {
    // ---- IMAGE CELL ----
    // Find the image inside .cmp-teaser__image > [data-cmp-is="image"] > img or any img inside .cmp-teaser__image
    let img = null;
    const teaserImg = slide.querySelector('.cmp-teaser__image');
    if (teaserImg) {
      img = teaserImg.querySelector('img');
    } else {
      img = slide.querySelector('img');
    }
    // If no image at all, cell will be empty (should not happen for carousel)

    // ---- TEXT CELL ----
    // Compose all text content: heading, description, action link
    const textCellParts = [];
    const content = slide.querySelector('.cmp-teaser__content');
    if (content) {
      // Heading (h2/h1/h3)
      const heading = content.querySelector('h2, h1, h3');
      if (heading) textCellParts.push(heading);
      // Description
      const description = content.querySelector('.cmp-teaser__description');
      if (description) textCellParts.push(description);
      // CTA link - could be in cmp-teaser__action-container or directly
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) textCellParts.push(cta);
    }
    // Fallback if no .cmp-teaser__content (should not occur)
    // Only use text cell if any parts are found
    const textCell = textCellParts.length > 0 ? textCellParts : '';

    cells.push([img || '', textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
