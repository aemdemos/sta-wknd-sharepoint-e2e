/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slides from the carousel
  function getSlides(carouselEl) {
    const slides = [];
    // Find the carousel content container
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return slides;
    // Each slide is a direct child with class 'cmp-carousel__item'
    const items = content.querySelectorAll(':scope > .cmp-carousel__item');
    items.forEach((item) => {
      // Find image (mandatory)
      let imgEl = item.querySelector('img');
      // Defensive: fallback to first image in slide
      if (!imgEl) {
        imgEl = item.querySelector('img');
      }
      // Text content (optional): get all non-image children
      let textContent = null;
      // Instead of filtering by class, gather all children except image containers
      const textEls = Array.from(item.children).filter((child) => {
        // Exclude image containers and images themselves
        if (child.classList.contains('image') || child.querySelector('img')) return false;
        return true;
      });
      // If no direct children, try to find text in nested elements
      if (textEls.length === 0) {
        // Look for text blocks inside the item that are not image containers
        const possibleText = Array.from(item.querySelectorAll('*')).filter((el) => {
          if (el.classList.contains('image')) return false;
          if (el.querySelector('img')) return false;
          // Should contain some visible text
          return el.textContent && el.textContent.trim().length > 0;
        });
        if (possibleText.length) {
          textContent = document.createElement('div');
          possibleText.forEach((el) => {
            // Clone node to avoid moving from original DOM
            textContent.appendChild(el.cloneNode(true));
          });
        }
      } else {
        textContent = document.createElement('div');
        textEls.forEach((el) => {
          textContent.appendChild(el.cloneNode(true));
        });
      }
      // Always push two columns: image, then text (may be empty string if none)
      slides.push([
        imgEl,
        (textContent && textContent.childNodes.length) ? textContent : ''
      ]);
    });
    return slides;
  }

  // Find the carousel element inside the block
  const carouselEl = element.querySelector('.cmp-carousel');
  if (!carouselEl) return;

  // Build the table rows
  const headerRow = ['Carousel (carousel8)']; // Only one column in header row
  const rows = [headerRow];

  // Extract slides
  const slideRows = getSlides(carouselEl);
  // Ensure every slide row has exactly two columns (image, text or empty string)
  slideRows.forEach(row => {
    if (row.length < 2) row.push('');
    if (row.length > 2) row.length = 2;
  });
  rows.push(...slideRows);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
