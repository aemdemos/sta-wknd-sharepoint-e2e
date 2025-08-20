/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by the instructions and example
  const headerRow = ['Carousel (carousel22)'];

  // Find all carousel items/slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  const slideEls = Array.from(carouselContent.children)
    .filter((child) => child.classList.contains('cmp-carousel__item'));

  const rows = slideEls.map((slideEl) => {
    // First cell: Image
    let imgEl = null;
    const teaserImageWrap = slideEl.querySelector('.cmp-teaser__image');
    if (teaserImageWrap) {
      imgEl = teaserImageWrap.querySelector('img');
    }

    // Second cell: Title, Description, CTA (all optional)
    const textContent = [];
    const teaserContent = slideEl.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl && titleEl.textContent.trim()) {
        textContent.push(titleEl);
      }
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) {
        // Description may have HTML, so preserve children
        if (descEl.childNodes.length > 0) {
          Array.from(descEl.childNodes).forEach((node) => {
            // Only add elements and non-empty text nodes
            if ((node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim())) {
              textContent.push(node);
            }
          });
        } else if (descEl.textContent.trim()) {
          textContent.push(descEl);
        }
      }
      // CTA
      const ctaEl = teaserContent.querySelector('.cmp-teaser__action-link');
      if (ctaEl && ctaEl.textContent.trim()) {
        textContent.push(ctaEl);
      }
    }

    // Always pass an array for the second cell, even if empty
    return [imgEl, textContent];
  });

  // Compose the final table
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
