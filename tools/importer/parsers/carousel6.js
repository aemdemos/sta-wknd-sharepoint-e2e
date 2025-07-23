/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we correctly find the cmp-carousel within the given element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides (immediate children with cmp-carousel__item)
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Prepare the rows array for the block table
  const rows = [['Carousel (carousel6)']];

  slides.forEach((slide) => {
    // Default empty cells in case of missing data
    let imgCell = '';
    let textCell = '';

    // Find the teaser within the slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (teaser) {
      // --- IMAGE ---
      const imgDiv = teaser.querySelector('.cmp-teaser__image .cmp-image img');
      if (imgDiv) {
        imgCell = imgDiv;
      }
      // --- TEXT ---
      const textCellContents = [];
      const contentDiv = teaser.querySelector('.cmp-teaser__content');
      if (contentDiv) {
        // Title (Heading)
        const title = contentDiv.querySelector('.cmp-teaser__title');
        if (title) {
          textCellContents.push(title);
        }
        // Description (could be <div> or <p> or both)
        const desc = contentDiv.querySelector('.cmp-teaser__description');
        if (desc) {
          // If description holds a single paragraph or is plain text, push as is
          if (desc.children.length === 0) {
            textCellContents.push(desc);
          } else {
            // If the desc is a container (e.g., has <p>), push its children individually
            Array.from(desc.children).forEach(child => textCellContents.push(child));
          }
        }
        // Call to Action link
        const actionContainer = contentDiv.querySelector('.cmp-teaser__action-container');
        if (actionContainer) {
          const ctaLinks = Array.from(actionContainer.querySelectorAll('a'));
          if (ctaLinks.length > 0) {
            textCellContents.push(...ctaLinks);
          }
        }
      }
      if (textCellContents.length) {
        textCell = textCellContents;
      }
    }
    // Always two columns, as per block definition
    rows.push([imgCell, textCell]);
  });

  // Build the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
