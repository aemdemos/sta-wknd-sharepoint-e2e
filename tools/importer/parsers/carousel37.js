/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly as specified
  const headerRow = ['Carousel (carousel37)'];
  const rows = [headerRow];

  // Find the cmp-carousel__content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all slides
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  slides.forEach((slide) => {
    // First cell: image element (img)
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // Second cell: all slide content except image
    // We'll collect all elements except the ".image" container
    const textNodes = [];
    Array.from(slide.children).forEach((child) => {
      // Skip the image container
      if (child.classList.contains('image')) return;
      // If there is visible content, include it
      if (child.textContent && child.textContent.trim().length > 0) {
        textNodes.push(child);
      }
    });
    // If there are no extra children, try inside image container for meta/alt/title
    if (textNodes.length === 0 && img) {
      // Try title attribute as heading
      if (img.getAttribute('title')) {
        const h2 = document.createElement('h2');
        h2.textContent = img.getAttribute('title');
        textNodes.push(h2);
      }
      // Try alt attribute as description paragraph (only if not duplicate of title)
      if (img.getAttribute('alt')) {
        const alt = img.getAttribute('alt').trim();
        if (!img.getAttribute('title') || img.getAttribute('title').trim() !== alt) {
          const p = document.createElement('p');
          p.textContent = alt;
          textNodes.push(p);
        }
      }
      // Try meta caption
      const meta = slide.querySelector('meta[itemprop="caption"]');
      if (meta && meta.content) {
        // Only add as a paragraph if not duplicate of title/alt
        if (
          (!img.getAttribute('title') || img.getAttribute('title').trim() !== meta.content.trim()) &&
          (!img.getAttribute('alt') || img.getAttribute('alt').trim() !== meta.content.trim())
        ) {
          const p = document.createElement('p');
          p.textContent = meta.content;
          textNodes.push(p);
        }
      }
    }

    // If there are links (a) inside slide but not inside image, include those (CTAs)
    // Avoid duplicate links
    const foundLinks = slide.querySelectorAll(':scope > a');
    foundLinks.forEach((a) => {
      if (!textNodes.includes(a)) textNodes.push(a);
    });

    // If no text at all, set to empty string
    const textCell = textNodes.length > 0 ? textNodes : '';
    rows.push([imageCell, textCell]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
