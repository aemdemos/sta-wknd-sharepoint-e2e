/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name exactly as in example
  const headerRow = ['Carousel (carousel18)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel slides/items
  const slides = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');

  // Build rows for each slide
  const rows = Array.from(slides).map((slide) => {
    // 1st cell: image (reference existing element)
    let img = null;
    const imgContainer = slide.querySelector('.image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }

    // 2nd cell: all text content
    let contentArray = [];
    // Try to get image caption/title from meta or img.title
    let caption = '';
    if (imgContainer) {
      const meta = imgContainer.querySelector('meta[itemprop="caption"]');
      if (meta && meta.getAttribute('content')) {
        caption = meta.getAttribute('content').trim();
      } else if (img && img.title) {
        caption = img.title.trim();
      }
      if (caption) {
        // Use h3 for caption/title (semantic heading, like markdown example)
        const heading = document.createElement('h3');
        heading.textContent = caption;
        contentArray.push(heading);
      }
    }
    // Also, any additional text elements in slide (excluding .image)
    // If the slide contains other elements (e.g. paragraphs, links, etc), include them
    Array.from(slide.children).forEach((child) => {
      if (child !== imgContainer && child.nodeType === 1) {
        contentArray.push(child);
      }
    });
    // If no content in cell, use empty string
    if (contentArray.length === 0) {
      contentArray = [''];
    }
    return [img, contentArray];
  });

  // Build the block table: header row (single column), then each slide as a row with two columns
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
