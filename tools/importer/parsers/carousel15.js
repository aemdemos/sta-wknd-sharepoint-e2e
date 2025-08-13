/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: EXACT match to example
  const headerRow = ['Carousel (carousel15)'];

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Parse each slide
  const rows = slides.map((slide) => {
    // Image: first <img> inside the slide (at any depth)
    const img = slide.querySelector('img');

    // Text content cell: Collect ALL content from the slide except the image block
    // This ensures headings, paragraphs, CTA, etc, are included
    let textElements = [];
    Array.from(slide.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textElements.push(child);
      }
    });
    // If textElements is empty, cell should be empty string
    const textCell = textElements.length ? textElements : '';
    // Table row: [image, text]
    return [img ? img : '', textCell];
  });

  // Compose table and replace element
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
