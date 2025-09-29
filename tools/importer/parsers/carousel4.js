/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all direct carousel slide items
  function getSlides(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper to get the image element from a slide
  function getImageElement(slide) {
    // Find the first <img> inside the slide
    const img = slide.querySelector('img');
    return img || null;
  }

  // Helper to get all text content for a slide (flexible)
  function getTextContent(slide) {
    // Collect all direct children except image wrappers and navigation
    const textFragments = [];
    // Find all elements that are not part of the image
    // We'll exclude .image and its descendants
    const imageWrapper = slide.querySelector('.image');
    Array.from(slide.children).forEach(child => {
      if (imageWrapper && imageWrapper.contains(child)) return;
      // Exclude navigation/actions/indicators if present
      if (child.classList.contains('cmp-carousel__actions')) return;
      if (child.classList.contains('cmp-carousel__indicators')) return;
      // If the child has text or is a link, heading, paragraph, etc, include it
      if (child.textContent.trim() || child.querySelector('a, h1, h2, h3, h4, h5, h6, p')) {
        textFragments.push(child.cloneNode(true));
      }
    });
    // If nothing found, fallback to image alt/title/caption
    if (textFragments.length === 0) {
      const img = getImageElement(slide);
      if (img) {
        if (img.getAttribute('title')) {
          const h = document.createElement('h3');
          h.textContent = img.getAttribute('title');
          textFragments.push(h);
        } else if (img.getAttribute('alt')) {
          const p = document.createElement('p');
          p.textContent = img.getAttribute('alt');
          textFragments.push(p);
        }
      }
    }
    // If still nothing, return empty string
    if (textFragments.length === 0) return '';
    if (textFragments.length === 1) return textFragments[0];
    const frag = document.createDocumentFragment();
    textFragments.forEach(node => frag.appendChild(node));
    return frag;
  }

  // Find the cmp-carousel inside the block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides
  const slides = getSlides(carousel);

  // Build table rows
  const headerRow = ['Carousel (carousel4)'];
  const rows = [headerRow];

  slides.forEach(slide => {
    const img = getImageElement(slide);
    if (!img) return;
    const imageCell = img;
    const textCell = getTextContent(slide);
    rows.push([imageCell, textCell || '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
