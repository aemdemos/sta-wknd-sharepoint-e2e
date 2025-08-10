/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the slide details from a carousel item
  function extractSlide(slide) {
    // 1. Image (first cell)
    let img = null;
    let imgContainer = slide.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    if (!img) {
      img = slide.querySelector('img');
    }

    // 2. Text content (second cell)
    let textItems = [];
    let content = slide.querySelector('.cmp-teaser__content');
    if (content) {
      // Title (Heading)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) {
        // Use the existing h2 node if possible
        textItems.push(title);
      }
      // Description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) {
        // If only text, wrap in a <p>, if already has <p>, use as is
        if (desc.children.length === 0) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          textItems.push(p);
        } else {
          // Use all direct child nodes (may contain <p>, <span>, etc)
          Array.from(desc.childNodes).forEach(child => {
            textItems.push(child);
          });
        }
      }
      // CTA link (if present)
      const cta = content.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textItems.push(cta);
      }
    }
    return [img, textItems.length ? textItems : ''];
  }

  // Find the carousel DOM root
  let carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) carouselRoot = element;

  // Find direct slide containers (role=tabpanel)
  const slides = Array.from(carouselRoot.querySelectorAll(':scope > .cmp-carousel__content > .cmp-carousel__item'));

  const rows = [];
  // Table header
  rows.push(['Carousel (carousel22)']);

  // Each slide: [image, [title, desc, cta]]
  slides.forEach(slide => {
    // Look for the inner .teaser, fall back to slide itself
    const teaser = slide.querySelector('.teaser') || slide;
    const [img, text] = extractSlide(teaser);
    rows.push([img || '', text]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
