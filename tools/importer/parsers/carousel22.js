/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name for the header row
  const headerRow = ['Carousel (carousel22)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel items (slides)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Prepare rows for each slide
  const rows = items.map((item) => {
    // Defensive: find teaser block inside each item
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return ['', ''];

    // --- IMAGE CELL ---
    // Find the image element inside the teaser
    let imageEl = null;
    const teaserImageContainer = teaser.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      // Find the actual <img> inside the image container
      imageEl = teaserImageContainer.querySelector('img');
    }

    // --- TEXT CELL ---
    // Compose text cell with title, description, and CTA (if present)
    const textCellContent = [];

    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use a new heading element for semantic clarity
      const heading = document.createElement('h2');
      heading.textContent = titleEl.textContent.trim();
      textCellContent.push(heading);
    }

    // Description
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If description is a <div> with HTML, preserve its children
      if (descEl.children.length > 0) {
        Array.from(descEl.childNodes).forEach((node) => {
          textCellContent.push(node.cloneNode(true));
        });
      } else {
        // Otherwise, just use the text
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        textCellContent.push(p);
      }
    }

    // CTA (call-to-action) link
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      // Place CTA at the bottom of the cell
      const cta = document.createElement('a');
      cta.href = ctaEl.href;
      cta.textContent = ctaEl.textContent.trim();
      cta.className = 'carousel-cta';
      textCellContent.push(cta);
    }

    return [imageEl, textCellContent];
  });

  // Compose the table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
