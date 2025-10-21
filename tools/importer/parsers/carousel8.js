/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel8) block parsing
  // Header row as per spec
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all indicator texts (these are the visible slide titles)
  const indicators = Array.from(carousel.querySelectorAll('.cmp-carousel__indicator'));
  const indicatorTexts = indicators.map(ind => ind.textContent.trim());

  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  items.forEach((item, idx) => {
    // Image: look for .cmp-image__image inside this item
    let img = item.querySelector('.cmp-image__image');
    if (!img) {
      // Try fallback: any <img> in this item
      img = item.querySelector('img');
    }
    if (!img) return;

    // Use indicator text as the visible caption/title (if present)
    let textCell = '';
    if (indicatorTexts[idx]) {
      const heading = document.createElement('h2');
      heading.textContent = indicatorTexts[idx];
      textCell = heading;
    }

    rows.push([img, textCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
