/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all carousel items
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  }

  // Helper: Extract the image element from the slide (reference, not clone)
  function getImageElement(slide) {
    const teaserImgDiv = slide.querySelector('.cmp-teaser__image');
    if (teaserImgDiv) {
      const imgWrap = teaserImgDiv.querySelector('[data-cmp-is="image"]');
      if (imgWrap) {
        const img = imgWrap.querySelector('img');
        if (img) {
          return img;
        }
      }
    }
    return '';
  }

  // Helper: Get the text content element (reference existing elements where possible)
  function getTextContent(slide) {
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (!teaserContent) return '';
    // We'll construct a DocumentFragment for the cell to preserve hierarchy
    const fragment = document.createDocumentFragment();
    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) {
      // Use as heading, keep same level (h2)
      fragment.appendChild(title);
    }
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      // If the description is a <div> containing <p>, use the children, else use the div
      if (desc.childElementCount === 1 && desc.firstElementChild.tagName.toLowerCase() === 'p') {
        fragment.appendChild(desc.firstElementChild);
      } else {
        // If it's just text or other inline, keep the div
        fragment.appendChild(desc);
      }
    }
    // CTA
    const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) {
        // Add a <br> for spacing if there's previous content
        if (fragment.childNodes.length > 0) {
          fragment.appendChild(document.createElement('br'));
        }
        fragment.appendChild(ctaLink);
      }
    }
    // If fragment has no children, return empty
    if (fragment.childNodes.length === 0) return '';
    return fragment;
  }

  // Main parse logic
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const items = getCarouselItems(carousel);
  const rows = [];
  // Header row (must match exactly)
  rows.push(['Carousel (carousel22)']);
  items.forEach(item => {
    const imageEl = getImageElement(item);
    const textContent = getTextContent(item);
    rows.push([imageEl, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
