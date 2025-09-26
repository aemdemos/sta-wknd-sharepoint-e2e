/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract slide info from a carousel item
  function extractSlide(item) {
    // Defensive: find teaser block inside item
    const teaser = item.querySelector('.cmp-teaser');
    let imageEl = null;
    let textEls = [];

    if (teaser) {
      // Find image element
      const teaserImage = teaser.querySelector('.cmp-teaser__image');
      if (teaserImage) {
        // Find actual <img> inside
        imageEl = teaserImage.querySelector('img');
      }
      // Find text content
      const teaserContent = teaser.querySelector('.cmp-teaser__content');
      if (teaserContent) {
        // Title
        const title = teaserContent.querySelector('.cmp-teaser__title');
        if (title) textEls.push(title);
        // Description
        const desc = teaserContent.querySelector('.cmp-teaser__description');
        if (desc) textEls.push(desc);
        // CTA
        const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
        if (ctaContainer) {
          const cta = ctaContainer.querySelector('a');
          if (cta) textEls.push(cta);
        }
      }
    }
    // Defensive fallback: if no teaser, try to find image and text directly
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }
    if (textEls.length === 0) {
      // Try to find heading/paragraphs
      const heading = item.querySelector('h2, h3, h1');
      if (heading) textEls.push(heading);
      const paragraphs = item.querySelectorAll('p');
      paragraphs.forEach(p => textEls.push(p));
      // Try to find links
      const links = item.querySelectorAll('a');
      links.forEach(a => textEls.push(a));
    }
    return [imageEl, textEls];
  }

  // Get all carousel items/slides
  const carousel = element.querySelector('.cmp-carousel');
  const content = carousel ? carousel.querySelector('.cmp-carousel__content') : null;
  const items = content ? content.querySelectorAll(':scope > .cmp-carousel__item') : [];

  // Build table rows
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  items.forEach(item => {
    const [imageEl, textEls] = extractSlide(item);
    // Only add row if image exists
    if (imageEl) {
      rows.push([
        imageEl,
        textEls.length > 0 ? textEls : ''
      ]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
