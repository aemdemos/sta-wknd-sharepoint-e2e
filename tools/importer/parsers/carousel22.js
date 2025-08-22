/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  const rows = [];
  // First row is header, matching example exactly
  rows.push(['Carousel (carousel22)']);

  slides.forEach((slide) => {
    // Image: in .cmp-teaser__image, first <img>
    let imgCell = '';
    const imageWrapper = slide.querySelector('.cmp-teaser__image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) {
        imgCell = img;
      }
    }
    // Text content cell
    let textCell = '';
    const contentWrapper = slide.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      const cellContent = [];
      // Heading
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) cellContent.push(title);

      // Description (can be div or div>p)
      const desc = contentWrapper.querySelector('.cmp-teaser__description');
      if (desc) {
        // If .cmp-teaser__description contains <p>, use the <p> element(s)
        const ps = desc.querySelectorAll('p');
        if (ps.length > 0) {
          ps.forEach((p) => cellContent.push(p));
        } else {
          cellContent.push(desc);
        }
      }
      // CTA link (at bottom)
      const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
      if (cta) cellContent.push(cta);

      if (cellContent.length) textCell = cellContent;
    }
    // Only add rows where image is present (mandatory as per spec)
    if (imgCell) {
      rows.push([imgCell, textCell]);
    }
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
