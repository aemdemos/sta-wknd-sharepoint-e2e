/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Carousel (carousel22)'];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Helper to extract image from teaser
  function extractImage(teaser) {
    // Try to find the image inside the teaser
    const img = teaser.querySelector('.cmp-teaser__image img');
    return img || null;
  }

  // Helper to extract text content from teaser
  function extractTextContent(teaser) {
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (!contentDiv) return null;
    // Clone to avoid moving nodes out of DOM
    const contentClone = contentDiv.cloneNode(true);
    // Remove any image or unwanted elements from the clone
    const image = contentClone.querySelector('.cmp-teaser__image');
    if (image) image.remove();
    return contentClone;
  }

  // Build rows for each slide
  const rows = slides.map((slide) => {
    // Each slide contains a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];
    // Image cell
    const img = extractImage(teaser);
    // Text cell
    const textContent = extractTextContent(teaser);
    return [img, textContent];
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
