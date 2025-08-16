/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as shown in example
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // 2. Locate carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 3. Get all slides/items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  items.forEach(item => {
    // Image: always in the teaser > cmp-teaser__image > [img]
    let imageCell = null;
    const teaserImage = item.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const img = teaserImage.querySelector('img');
      if (img) imageCell = img;
    }
    
    // Content cell: collect all text, links in teaser > cmp-teaser__content
    let contentCell = [];
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (typically h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) contentCell.push(title);
      // Description (div or p)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) contentCell.push(desc);
      // CTA link (inside .cmp-teaser__action-container)
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        // Only add if contains an <a> link
        const a = ctaContainer.querySelector('a');
        if (a) contentCell.push(ctaContainer);
      }
    }
    
    // If only one piece, pass element directly, else array
    let cellValue = contentCell.length === 1 ? contentCell[0] : contentCell;
    // If content is empty, set to empty string
    if (!cellValue || (Array.isArray(cellValue) && cellValue.length === 0)) {
      cellValue = '';
    }
    
    // Add row: image, content
    cells.push([imageCell, cellValue]);
  });

  // 4. Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
