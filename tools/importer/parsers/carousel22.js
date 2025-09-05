/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Table header row as per block spec
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slide items
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    // Defensive: Find teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // --- IMAGE CELL ---
    // Find image container and img element
    let imgCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const cmpImage = teaserImage.querySelector('.cmp-image');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) {
          imgCell = img;
        }
      }
    }
    // Defensive fallback: If no image found, use teaserImage itself
    if (!imgCell && teaserImage) imgCell = teaserImage;

    // --- TEXT CELL ---
    const textContent = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description (div or p)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA link (a)
    const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) textContent.push(cta);
    }

    // Add row: [image, text]
    rows.push([
      imgCell,
      textContent.length ? textContent : '',
    ]);
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
