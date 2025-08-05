/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel within element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__item');
  if (slides.length === 0) return;

  // Create the header row
  const rows = [['Carousel (carousel6)']];

  slides.forEach(slide => {
    // Each slide has a .cmp-teaser
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // IMAGE cell: The image is inside .cmp-teaser__image img
    let imageCell = '';
    const img = teaser.querySelector('.cmp-teaser__image img');
    if (img) imageCell = img;

    // TEXT cell
    const contentEls = [];
    // Title (should be heading)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      // Sometimes it's direct text, sometimes contains <p>
      // We always want only the children (not the wrapping div)
      if (desc.children.length > 0) {
        contentEls.push(...desc.children);
      } else {
        contentEls.push(desc);
      }
    }
    // CTA (button or link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) contentEls.push(cta);

    // For text cell, if only one element, just pass that element, otherwise pass array
    const textCell = contentEls.length === 1 ? contentEls[0] : contentEls;

    rows.push([imageCell, textCell]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
