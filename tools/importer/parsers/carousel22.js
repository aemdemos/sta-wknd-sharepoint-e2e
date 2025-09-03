/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Get all carousel items (slides)
  const items = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');
  items.forEach((item) => {
    // Find the teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Find the image (first column)
    let imageEl = teaser.querySelector('.cmp-teaser__image img');
    // Defensive: fallback to any img inside teaser if structure changes
    if (!imageEl) imageEl = teaser.querySelector('img');
    if (!imageEl) return;

    // Find the teaser content (second column)
    const contentEl = teaser.querySelector('.cmp-teaser__content');
    // Defensive: fallback to teaser itself if contentEl missing
    let textCellContent = [];
    if (contentEl) {
      // Title (h2)
      const title = contentEl.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      // Description (div or p)
      const desc = contentEl.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);
      // CTA link
      const cta = contentEl.querySelector('.cmp-teaser__action-link');
      if (cta) textCellContent.push(cta);
    }
    // If no contentEl, fallback to teaser
    if (!contentEl) {
      // Try to get title, description, and CTA from teaser
      const title = teaser.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);
      const desc = teaser.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);
      const cta = teaser.querySelector('.cmp-teaser__action-link');
      if (cta) textCellContent.push(cta);
    }
    // If nothing found, use an empty string
    if (textCellContent.length === 0) textCellContent = [''];

    // Add row: [image, text content]
    rows.push([imageEl, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
