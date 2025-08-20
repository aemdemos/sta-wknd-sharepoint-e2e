/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row matches example exactly
  const headerRow = ['Carousel (carousel18)'];

  // Find carousel block root
  const carousel = element.querySelector(':scope > div > .cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  
  // Get all items/slides
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  const rows = [headerRow];

  items.forEach(item => {
    // Image is in first cell, mandatory
    let imageEl = null;
    const imageContainer = item.querySelector('.cmp-image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) imageEl = img;
    }
    if (!imageEl) return; // skip row if no image found
    
    // Second cell: text content (optional)
    let textCell = '';
    // Try to extract caption/title/alt from meta or img
    let caption = '';
    const metaCaption = imageContainer ? imageContainer.querySelector('meta[itemprop="caption"]') : null;
    if (metaCaption && metaCaption.content) {
      caption = metaCaption.content;
    } else if (imageEl && imageEl.title) {
      caption = imageEl.title;
    }
    // Only add heading if non-empty
    let heading = null;
    if (caption) {
      heading = document.createElement('h2');
      heading.textContent = caption;
    }
    // Description from alt attribute (if not same as caption)
    let description = null;
    if (imageEl && imageEl.alt && imageEl.alt !== caption) {
      description = document.createElement('div');
      description.textContent = imageEl.alt;
    }
    // Compose text cell if heading or description exists
    if (heading || description) {
      const parts = [];
      if (heading) parts.push(heading);
      if (description) parts.push(description);
      textCell = parts;
    }
    // Add row: image (existing element), text content (array or '')
    rows.push([imageEl, textCell]);
  });

  // Create table with rows
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
