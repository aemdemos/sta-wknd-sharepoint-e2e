/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser content from a carousel item
  function extractTeaserContent(item) {
    // Defensive: Find the teaser root
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];
    // Find image (mandatory)
    let imageEl = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the actual <img> element inside
      imageEl = teaserImage.querySelector('img');
    }
    // Find content (title, description, CTA)
    const contentEl = teaser.querySelector('.cmp-teaser__content');
    let contentParts = [];
    if (contentEl) {
      // Title (optional)
      const titleEl = contentEl.querySelector('.cmp-teaser__title');
      if (titleEl) contentParts.push(titleEl);
      // Description (optional)
      const descEl = contentEl.querySelector('.cmp-teaser__description');
      if (descEl) contentParts.push(descEl);
      // CTA (optional)
      const actionContainer = contentEl.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const ctaEl = actionContainer.querySelector('a');
        if (ctaEl) contentParts.push(ctaEl);
      }
    }
    // Defensive: If no content, set null
    if (contentParts.length === 0) contentParts = null;
    return [imageEl, contentParts];
  }

  // Find all carousel items (slides)
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const contentRoot = carouselRoot.querySelector('.cmp-carousel__content');
  if (!contentRoot) return;
  const items = Array.from(contentRoot.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows
  const headerRow = ['Carousel (carousel3)'];
  const rows = [headerRow];
  items.forEach(item => {
    const [imageEl, contentParts] = extractTeaserContent(item);
    // Only add row if image exists
    if (imageEl) {
      rows.push([
        imageEl,
        contentParts ? contentParts : ''
      ]);
    }
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
