/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as required
  const headerRow = ['Carousel (carousel18)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slide items
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');

  // Prepare rows array
  const rows = [headerRow];

  items.forEach(item => {
    // Find the image inside the item
    const img = item.querySelector('img');
    // Collect all visible text content inside the slide
    // We'll include headings, paragraphs, spans, and links
    const textParts = [];
    item.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a').forEach(el => {
      // Only include elements with visible text
      if (el.textContent && el.textContent.trim()) {
        textParts.push(el.cloneNode(true));
      }
    });
    // Always push two columns per row (image, text)
    rows.push([img, textParts.length > 0 ? textParts : '']);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
