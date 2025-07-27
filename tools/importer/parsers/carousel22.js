/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a single slide's content into [img, [text elements]]
  function extractSlide(slide) {
    // Find image (first cell)
    let img = null;
    // Prefer .cmp-teaser__image img
    const imgContainer = slide.querySelector('.cmp-teaser__image .cmp-image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    if (!img) {
      img = slide.querySelector('img');
    }

    // Build the content cell (title, description, cta)
    const contentParts = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title: keep semantic heading
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        contentParts.push(title);
      }
      // Description: can be div or contain <p>
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // If contains elements, include as-is; otherwise, wrap plain text in a <p>
        if (desc.children.length > 0) {
          Array.from(desc.childNodes).forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())) {
              contentParts.push(n);
            }
          });
        } else if (desc.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          contentParts.push(p);
        }
      }
      // CTA link
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) {
        contentParts.push(cta);
      }
    } else {
      // Fallback for missing .cmp-teaser__content
      const title = slide.querySelector('h1, h2, h3, h4, h5, h6');
      if (title) contentParts.push(title);
      const desc = slide.querySelector('p');
      if (desc) contentParts.push(desc);
      const cta = slide.querySelector('a');
      if (cta) contentParts.push(cta);
    }
    return [img, contentParts.length > 0 ? contentParts : ''];
  }

  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const contentRoot = carousel.querySelector('.cmp-carousel__content');
  if (!contentRoot) return;

  // All slides
  const slides = Array.from(contentRoot.querySelectorAll(':scope > .cmp-carousel__item'));
  if (slides.length === 0) return;

  // Table rows
  const rows = [];
  // Header row - must match exactly
  rows.push(['Carousel (carousel22)']);

  // Slide rows: [image, content]
  slides.forEach((slide) => {
    const [img, content] = extractSlide(slide);
    rows.push([img, content]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
