/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified for the block
  const headerRow = ['Carousel (carousel26)'];

  // Prepare the slides rows array
  const slideRows = [];

  // For generality: each .cmp-teaser in a carousel block becomes a row.
  // Here, we only have one, but code supports multiple.
  const teaserEls = element.querySelectorAll('.cmp-teaser');
  (teaserEls.length ? teaserEls : [element]).forEach((teaser) => {
    // Image cell (first column)
    let imgEl = null;
    const imageWrapper = teaser.querySelector('.cmp-teaser__image');
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    // Text content cell (second column)
    const textContent = [];
    const contentEl = teaser.querySelector('.cmp-teaser__content');
    if (contentEl) {
      // Title (Heading)
      const titleEl = contentEl.querySelector('.cmp-teaser__title');
      if (titleEl) textContent.push(titleEl);
      // Description
      const descEl = contentEl.querySelector('.cmp-teaser__description');
      if (descEl) textContent.push(descEl);
      // CTA link
      const ctaEl = contentEl.querySelector('.cmp-teaser__action-link');
      if (ctaEl) textContent.push(ctaEl);
    }
    // Add row for this slide
    if (imgEl || textContent.length) {
      slideRows.push([imgEl, textContent]);
    }
  });

  // Compose the table data
  const cells = [headerRow, ...slideRows];
  
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
