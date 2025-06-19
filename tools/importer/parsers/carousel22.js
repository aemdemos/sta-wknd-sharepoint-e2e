/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the slides within the carousel
  const slides = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  // Table header - must exactly match the block name
  const rows = [['Carousel (carousel22)']];

  slides.forEach((slide) => {
    // Get the image element (referencing the <img> node itself)
    let imgEl = null;
    const teaserImgWrap = slide.querySelector('.cmp-teaser__image');
    if (teaserImgWrap) {
      imgEl = teaserImgWrap.querySelector('img');
    }

    // Gather text content
    const contentEl = slide.querySelector('.cmp-teaser__content');
    let textParts = [];
    if (contentEl) {
      // Heading
      const title = contentEl.querySelector('.cmp-teaser__title');
      if (title) {
        // Use the existing heading element
        textParts.push(title);
      }
      // Description (could be text or HTML)
      const descWrap = contentEl.querySelector('.cmp-teaser__description');
      if (descWrap) {
        // If the description contains paragraphs, reference them individually
        const ps = descWrap.querySelectorAll('p');
        if (ps.length > 0) {
          ps.forEach((p) => {
            textParts.push(p);
          });
        } else {
          // Otherwise reference the wrapper div
          textParts.push(descWrap);
        }
      }
      // CTA link (action)
      const cta = contentEl.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textParts.push(cta);
      }
    }
    rows.push([
      imgEl,
      textParts.length > 0 ? textParts : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
