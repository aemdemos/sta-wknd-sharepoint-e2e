/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Carousel (carousel17)'];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel items (slides)
  const slides = content.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) return;

  // Prepare rows: each row is [image] if no text, or [image, text] if text exists
  const rows = Array.from(slides).map((slide) => {
    // Find the image (mandatory)
    const img = slide.querySelector('img');
    if (!img) return null;

    // Collect all text content within the slide, excluding the image
    // We'll look for headings, paragraphs, links, and any text nodes
    const textNodes = [];
    // Only consider elements that are not the image container
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        // If it's an element, collect its text content
        if (child.textContent && child.textContent.trim()) {
          textNodes.push(child.cloneNode(true));
        }
        // If it's a link or other element, include it
        if (child.querySelectorAll) {
          child.querySelectorAll('a, h1, h2, h3, h4, h5, h6, p, span').forEach(el => {
            if (el.textContent && el.textContent.trim()) {
              textNodes.push(el.cloneNode(true));
            }
          });
        }
      }
    });

    if (textNodes.length > 0) {
      // If there's text content, wrap it in a div for structure
      const div = document.createElement('div');
      textNodes.forEach(node => div.appendChild(node));
      return [img, div];
    } else {
      // Only image, single column
      return [img];
    }
  }).filter(Boolean);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
