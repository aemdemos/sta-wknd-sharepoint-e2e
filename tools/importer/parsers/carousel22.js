/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Defensive: Find teaser block inside slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Get image (first column)
    let imageEl = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the actual <img> element
      imageEl = teaserImage.querySelector('img');
    }
    // Defensive: If no image, skip this slide
    if (!imageEl) return;

    // Get text content (second column)
    const contentArr = [];
    // Title
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Wrap in heading if not already
      let heading;
      if (/^h[1-6]$/i.test(titleEl.tagName)) {
        heading = titleEl;
      } else {
        heading = document.createElement('h2');
        heading.textContent = titleEl.textContent;
      }
      contentArr.push(heading);
    }
    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      contentArr.push(descEl);
    }
    // CTA link
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        contentArr.push(ctaLink);
      }
    }

    rows.push([imageEl, contentArr]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
