/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Carousel (carousel27)'];

  // Handle the slides: each slide is 2 columns: [image, text content]
  const rows = [];

  // Support possible multiple slides if they exist (general enough)
  // Look for child .cmp-teaser blocks (for single slide, it's just this element)
  let slides = [];
  if (element.classList.contains('cmp-teaser')) {
    slides = [element];
  } else {
    slides = Array.from(element.querySelectorAll('.cmp-teaser'));
    if (slides.length === 0) slides = [element]; // fallback: treat element as slide
  }

  slides.forEach((slide) => {
    // Image: always first column
    let imgEl = null;
    const imgWrapper = slide.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Second column: Title, Description, CTA. All elements referenced directly if present.
    const contentWrapper = slide.querySelector('.cmp-teaser__content');
    const textCellContent = [];
    if (contentWrapper) {
      // Title (heading)
      const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
      if (titleEl) textCellContent.push(titleEl);
      // Description
      const descEl = contentWrapper.querySelector('.cmp-teaser__description');
      if (descEl) textCellContent.push(descEl);
      // CTA
      const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
      if (ctaContainer) {
        // Could be multiple CTAs, grab all links inside
        const ctaLinks = Array.from(ctaContainer.querySelectorAll('a'));
        textCellContent.push(...ctaLinks);
      }
    }
    // If nothing found, don't pass empty arrays -- fallback to empty string
    rows.push([imgEl || '', textCellContent.length ? textCellContent : '']);
  });

  // Compose block table: header row + slide rows
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
