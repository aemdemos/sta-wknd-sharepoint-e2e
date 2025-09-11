/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  if (!items.length) return;

  // Table header row
  const headerRow = ['Carousel (carousel11)'];
  const rows = [headerRow];

  // For each slide
  items.forEach((item) => {
    // Defensive: find teaser block inside item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image element (mandatory)
    let imageCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageCell = teaserImage;
    } else {
      // fallback: try to find any img inside teaser
      const fallbackImg = teaser.querySelector('img');
      if (fallbackImg) imageCell = fallbackImg;
    }
    if (!imageCell) imageCell = document.createTextNode(''); // fallback empty

    // --- TEXT CELL ---
    const textCellContent = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      // Use heading element directly
      textCellContent.push(title);
    }
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      textCellContent.push(desc);
    }
    // CTA link
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textCellContent.push(cta);
    }
    // Defensive: if no text content, add empty node
    if (textCellContent.length === 0) {
      textCellContent.push(document.createTextNode(''));
    }

    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
