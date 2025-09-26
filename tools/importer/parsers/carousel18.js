/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image element from carousel item
  function getImageEl(item) {
    // Find the first img inside the carousel item
    const img = item.querySelector('img');
    if (!img) return null;
    // Return the closest .cmp-image div if exists, else the img itself
    const cmpImageDiv = img.closest('.cmp-image');
    return cmpImageDiv || img;
  }

  // Helper to extract all text content from carousel item
  function getTextContent(item) {
    // Try to find a heading or caption
    let heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    // If no heading, try to use the image alt as heading
    if (!heading) {
      const img = item.querySelector('img');
      if (img && img.alt) {
        heading = document.createElement('h2');
        heading.textContent = img.alt;
      }
    }
    // Try to find paragraphs
    const paragraphs = Array.from(item.querySelectorAll('p'));
    // If no paragraphs, try to use meta caption as a paragraph
    let metaCaption = null;
    if (paragraphs.length === 0) {
      const meta = item.querySelector('meta[itemprop="caption"]');
      if (meta && meta.content) {
        metaCaption = document.createElement('p');
        metaCaption.textContent = meta.content;
      }
    }
    // Compose text cell
    if (heading || paragraphs.length || metaCaption) {
      const container = document.createElement('div');
      if (heading) container.appendChild(heading);
      paragraphs.forEach(p => container.appendChild(p.cloneNode(true)));
      if (metaCaption) container.appendChild(metaCaption);
      return container;
    }
    return null;
  }

  // Find the actual carousel content block
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!items.length) return;

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel18)'];
  rows.push(headerRow);

  items.forEach(item => {
    const imageCell = getImageEl(item);
    const textCell = getTextContent(item);
    // Always create two columns per row for consistency
    rows.push([imageCell, textCell || '']);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
