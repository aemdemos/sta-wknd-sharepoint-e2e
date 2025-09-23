/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row: must match target block name
  const headerRow = ['Carousel (carousel21)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each slide contains a .cmp-teaser block
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image: reference the actual <img> element
    let imageCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageCell = teaserImage;
    }
    if (!imageCell) return; // Image is mandatory

    // Text cell: collect all text content, preserving semantic structure
    const textCellContent = [];
    const teaserContent = teaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) textCellContent.push(title);

      // Description (may contain HTML)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) textCellContent.push(desc);

      // CTA link
      const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        const ctaLink = ctaContainer.querySelector('a');
        if (ctaLink) textCellContent.push(ctaLink);
      }
    }

    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
