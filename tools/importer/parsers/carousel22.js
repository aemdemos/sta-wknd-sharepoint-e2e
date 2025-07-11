/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Locate the cmp-carousel block within the given element
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) {
    // No carousel found, do nothing
    return;
  }

  // Get all the direct slide items
  const slides = cmpCarousel.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // Image cell: get the .cmp-image__image inside the slide
    let imgCell = '';
    const img = slide.querySelector('.cmp-image__image');
    if (img) {
      imgCell = img;
    }
    
    // Text content cell
    let textCell = '';
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // We'll gather h2/h1, description, and CTA (if available) in order
      const fragments = [];
      const title = teaserContent.querySelector('.cmp-teaser__title, h2, h1');
      if (title) {
        fragments.push(title);
      }
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // We need to preserve direct HTML (such as <p>s inside description)
        // If desc has multiple children, append them all
        if (desc.children.length > 0) {
          Array.from(desc.childNodes).forEach(node => {
            fragments.push(node);
          });
        } else {
          fragments.push(desc);
        }
      }
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) {
        fragments.push(cta);
      }
      if (fragments.length) {
        textCell = fragments;
      }
    }
    cells.push([imgCell, textCell]);
  });
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
