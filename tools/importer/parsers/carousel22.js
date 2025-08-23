/* global WebImporter */
export default function parse(element, { document }) {
  // Block header: must match the example exactly
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find the main carousel component
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Slides are all direct children with class 'cmp-carousel__item' under '.cmp-carousel__content'
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  items.forEach((item) => {
    // --- First column: Image ---
    let imageCell = null;
    const teaserImage = item.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      // Find the <img> tag inside
      const img = teaserImage.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // --- Second column: Text Content ---
    const textCellContents = [];
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (h2)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContents.push(title); // reference original element
      }
      // Description (can have <p> inside, or just text)
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        // If desc is a <div> containing <p>, use content of <p> in order
        if (desc.children.length > 0) {
          Array.from(desc.children).forEach(child => {
            if (child.tagName.toLowerCase() === 'p') {
              textCellContents.push(child);
            }
          });
        } else {
          // Just a <div> with text
          textCellContents.push(desc);
        }
      }
      // CTA (link/button)
      const cta = teaserContent.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textCellContents.push(cta);
      }
    }

    // Add the slide row
    cells.push([imageCell, textCellContents]);
  });

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
