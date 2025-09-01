/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Carousel (carousel20)'];

  // Find the cmp-carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides (cmp-carousel__item)
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  const rows = slides.map((slide) => {
    // Find main teaser block within slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return [null, null];

    // ------ First cell: Image (mandatory) ------
    let image = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const cmpImage = teaserImage.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        image = cmpImage.querySelector('img');
      }
    }
    // Make sure the image element remains in the DOM, we just reference it.

    // ------ Second cell: Text (title, description, CTA) ------
    const textContent = [];
    // Title (as heading)
    const teaserTitle = teaser.querySelector('.cmp-teaser__title');
    if (teaserTitle) textContent.push(teaserTitle);
    // Description
    const teaserDesc = teaser.querySelector('.cmp-teaser__description');
    if (teaserDesc) textContent.push(teaserDesc);
    // CTA (may or may not exist)
    const teaserCTA = teaser.querySelector('.cmp-teaser__action-link');
    if (teaserCTA) textContent.push(teaserCTA);

    return [image, textContent];
  });

  // Only keep rows which have at least an image (as per requirement)
  const cleanRows = rows.filter(row => row[0]);

  // Compose table
  const cells = [headerRow, ...cleanRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
