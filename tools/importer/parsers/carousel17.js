/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel17) block parsing
  // 1. Header row
  const headerRow = ['Carousel (carousel17)'];

  // 2. Find carousel items/slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Only slides (not actions/indicators)
  const slideEls = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // 3. Build rows for each slide
  const rows = slideEls.map((slide) => {
    // Find image element inside the slide
    const img = slide.querySelector('img');
    // Defensive: If no image, skip this slide
    if (!img) return null;
    // Find text content inside the slide (title, description, CTA)
    // Look for heading elements, paragraphs, and links
    const textContent = [];
    // Heading (h1-h6)
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textContent.push(heading.cloneNode(true));
    // Paragraphs
    slide.querySelectorAll('p').forEach(p => textContent.push(p.cloneNode(true)));
    // Links
    slide.querySelectorAll('a').forEach(a => textContent.push(a.cloneNode(true)));
    // If no text content found, use empty string
    const textCell = textContent.length > 0 ? textContent : '';
    return [img, textCell];
  }).filter(Boolean);

  // 4. Compose table data
  const cells = [headerRow, ...rows];

  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(block);
}
