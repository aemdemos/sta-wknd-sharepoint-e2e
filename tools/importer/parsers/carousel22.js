/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel item elements (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!items.length) return;

  // Table header row as in example
  const cells = [['Carousel (carousel22)']];

  // For each slide, extract [image, text content]
  items.forEach(item => {
    // Find teaser inside item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Find image element: always use the referenced img element from the DOM
    const img = teaser.querySelector('img');
    // Defensive fallback if not found
    if (!img) return;

    // Build text content cell
    const cellContent = [];
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Reference original title element
      cellContent.push(title);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains <p>, add these; else add desc itself
      const paragraphs = desc.querySelectorAll('p');
      if (paragraphs.length) {
        // Reference all <p> nodes
        paragraphs.forEach(p => cellContent.push(p));
      } else {
        cellContent.push(desc);
      }
    }
    // CTA (action link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      cellContent.push(cta);
    }

    // Add row for this slide
    cells.push([img, cellContent]);
  });

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
