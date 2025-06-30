/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should be exactly one column, as per the example
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Get carousel container and slides
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // For each slide
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  items.forEach((item) => {
    // IMAGE cell
    let imageCell = '';
    const img = item.querySelector('.cmp-image img');
    if (img) imageCell = img;
    // TEXT cell (all non-image direct content, if present)
    let textCell = '';
    const contentBlocks = Array.from(item.children).filter(c => !c.classList.contains('image'));
    if (contentBlocks.length > 0) textCell = contentBlocks;
    // Each row should be a two-column array
    rows.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
