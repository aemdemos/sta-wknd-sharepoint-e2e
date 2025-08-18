/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const headerRow = ['Carousel (carousel22)'];
  const cells = [headerRow];

  // Find the cmp-carousel node
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Select only direct children of .cmp-carousel__content that are .cmp-carousel__item (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = content.querySelectorAll(':scope > .cmp-carousel__item');

  slides.forEach((slide) => {
    // Image cell
    let imageCell = null;
    // Text content cell
    let textCell = null;

    // Find image: inside .cmp-teaser__image, grab the <img>
    const teaserImageDiv = slide.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      const img = teaserImageDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text content: inside .cmp-teaser__content
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // We'll collect: Title, Description, and CTA (if present)
      const textContentFragments = [];

      // Title
      const titleEl = teaserContent.querySelector('.cmp-teaser__title');
      if (titleEl) {
        // Use heading as is for semantic correctness
        textContentFragments.push(titleEl);
      }
      // Description
      const descEl = teaserContent.querySelector('.cmp-teaser__description');
      if (descEl) {
        // If it contains <p>, include those, else include the div itself
        if (descEl.children.length > 0) {
          Array.from(descEl.children).forEach(child => {
            textContentFragments.push(child);
          });
        } else {
          textContentFragments.push(descEl);
        }
      }
      // CTA link
      const actionLink = teaserContent.querySelector('.cmp-teaser__action-container a');
      if (actionLink) {
        textContentFragments.push(actionLink);
      }
      if (textContentFragments.length > 0) {
        textCell = textContentFragments;
      }
    }

    // Assemble the row: [imageCell, textCell]
    cells.push([imageCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
