/* global WebImporter */
export default function parse(element, { document }) {
  function extractSlides(carouselEl) {
    const slides = [];
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return slides;
    const items = content.querySelectorAll(':scope > .cmp-carousel__item');
    items.forEach((item) => {
      let img = item.querySelector('img');
      if (!img) {
        const imageDiv = item.querySelector('.cmp-image');
        if (imageDiv) {
          img = imageDiv.querySelector('img');
        }
      }
      let textCell = '';
      // Try to extract any text content overlayed on the image (if present)
      // Look for heading and paragraph inside the item
      const heading = item.querySelector('h2, h3, h4, h5, h6');
      const paragraphs = item.querySelectorAll('p');
      // Compose text cell if any text exists
      if (heading || paragraphs.length > 0) {
        const frag = document.createDocumentFragment();
        if (heading) {
          const h = heading.cloneNode(true);
          frag.appendChild(h);
        }
        paragraphs.forEach((p) => {
          const pClone = p.cloneNode(true);
          frag.appendChild(pClone);
        });
        textCell = frag;
      }
      if (img) {
        const imageClone = img.cloneNode(true);
        // Always output two columns per slide row (image, text cell)
        slides.push([imageClone, textCell]);
      }
    });
    return slides;
  }

  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) {
    carousel = element;
  }
  if (!carousel) return;

  const headerRow = ['Carousel (carousel34)'];
  const rows = [headerRow];
  const slides = extractSlides(carousel);
  rows.push(...slides);

  // Ensure all slide rows have two columns
  rows.forEach((row, i) => {
    if (i === 0) return;
    while (row.length < 2) row.push('');
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
