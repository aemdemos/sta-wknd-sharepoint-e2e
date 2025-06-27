/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel inside the section
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  // Gather all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Header row: block name
  const rows = [
    ['Carousel (carousel6)']
  ];

  slides.forEach((slide) => {
    // -----------
    // 1. Image cell (img, NOT cloned)
    let imgEl = null;
    const teaserImageDiv = slide.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      // Try to find the image inside the image block
      imgEl = teaserImageDiv.querySelector('img');
    }
    // If not found, leave cell empty

    // -----------
    // 2. Text content cell (reference existing elements from DOM)
    const contentCellEls = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (h2, referenced)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        contentCellEls.push(title);
      }
      // Description (preserve structure, referenced)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        contentCellEls.push(desc);
      }
      // CTA link (referenced, not cloned)
      const action = teaserContent.querySelector('.cmp-teaser__action-link');
      if (action) {
        contentCellEls.push(action);
      }
    }
    // Compose row
    rows.push([
      imgEl,
      contentCellEls.length === 1 ? contentCellEls[0] : contentCellEls
    ]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
