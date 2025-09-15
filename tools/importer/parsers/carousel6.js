/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  }

  // Helper to extract image element from a carousel item
  function getImageElement(item) {
    // Find the teaser image container
    const teaserImage = item.querySelector('.cmp-teaser__image');
    if (!teaserImage) return null;
    // Find the actual <img> inside
    const img = teaserImage.querySelector('img');
    return img || null;
  }

  // Helper to extract text content (title, description, CTA) from a carousel item
  function getTextContentElement(item) {
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (!teaserContent) return null;
    // We'll build a fragment with title, description, and CTA (if present)
    const frag = document.createElement('div');
    // Title (h2)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) {
      // Use h2 as is, but clone to avoid moving from original DOM
      frag.appendChild(title.cloneNode(true));
    }
    // Description (div or p)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      // If description contains a <p>, use the <p>, else use the div
      const p = desc.querySelector('p');
      if (p) {
        frag.appendChild(p.cloneNode(true));
      } else {
        frag.appendChild(desc.cloneNode(true));
      }
    }
    // CTA (link)
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) {
      frag.appendChild(cta.cloneNode(true));
    }
    // If nothing was added, return null
    if (!frag.hasChildNodes()) return null;
    return frag;
  }

  // Find the carousel root (the element with class 'cmp-carousel')
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel items
  const items = getCarouselItems(carousel);
  if (!items.length) return;

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Carousel (carousel6)'];
  rows.push(headerRow);

  // Each slide: [image, text content]
  items.forEach(item => {
    const img = getImageElement(item);
    const text = getTextContentElement(item);
    // Defensive: image is required, text is optional
    if (img) {
      rows.push([img, text || '']);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
