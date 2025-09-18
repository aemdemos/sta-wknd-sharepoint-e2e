/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the carousel root (the element with class 'cmp-carousel')
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the content container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides (each with class 'cmp-carousel__item')
  const slides = content.querySelectorAll(':scope > .cmp-carousel__item');

  // Prepare the table rows
  const rows = [];
  // Header row as per the requirements
  rows.push(['Carousel (carousel21)']);

  slides.forEach((slide) => {
    // Each slide contains a .teaser.cmp-teaser--hero
    const teaser = slide.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser.cmp-teaser--hero');
    if (!teaser) return;

    // Image cell: find the first <img> inside .cmp-teaser__image
    let imageCell = '';
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageCell = teaserImage;
    }

    // Text cell: build a fragment with title, description, and CTA if present
    const textCellContent = [];
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      // Title (h2)
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContent.push(title);
      }
      // Description (div or p)
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) {
        // If description contains <p>, use the <p> elements, else use the div
        const ps = desc.querySelectorAll('p');
        if (ps.length > 0) {
          ps.forEach(p => textCellContent.push(p));
        } else {
          textCellContent.push(desc);
        }
      }
      // CTA (a)
      const cta = contentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textCellContent.push(cta);
      }
    }

    rows.push([
      imageCell,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
