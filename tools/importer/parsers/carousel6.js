/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel root inside the input element
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  const content = carouselRoot.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  const cells = [
    ['Carousel (carousel6)']
  ];

  slides.forEach((slide) => {
    // Find the teaser (if present)
    const teaser = slide.querySelector('.teaser.cmp-teaser--hero') || slide;
    // Get image in first cell
    let imgCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imgCell = teaserImage;
    }
    // Compose text content for second cell: title, description, CTA
    const contentCellElements = [];
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) contentCellElements.push(title);
    // Description (can contain markup)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) contentCellElements.push(desc);
    // CTA (link)
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    let cta = null;
    if (ctaContainer) {
      cta = ctaContainer.querySelector('a');
      if (cta) {
        // Ensure separation from previous content
        if (contentCellElements.length > 0) {
          contentCellElements.push(document.createElement('br'));
        }
        contentCellElements.push(cta);
      }
    }
    cells.push([
      imgCell,
      contentCellElements.length > 0 ? contentCellElements : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
