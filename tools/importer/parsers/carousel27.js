/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row with the exact block name
  const cells = [
    ['Carousel (carousel27)']
  ];

  // Defensive: Only process if we have a .cmp-teaser inside
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    // --- IMAGE COLUMN ---
    let imageEl = null;
    const imageSection = teaser.querySelector('.cmp-teaser__image');
    if (imageSection) {
      const img = imageSection.querySelector('img');
      if (img) {
        // Always reference the existing element (do not clone)
        imageEl = img;
      }
    }

    // --- TEXT COLUMN ---
    const textContentArr = [];
    const contentSection = teaser.querySelector('.cmp-teaser__content');
    if (contentSection) {
      // Title (should be heading)
      const title = contentSection.querySelector('.cmp-teaser__title');
      if (title) {
        // Preserve heading level (h2 is typical, fallback to div if not present)
        if (title.tagName.toLowerCase() === 'h2') {
          textContentArr.push(title);
        } else {
          const h2 = document.createElement('h2');
          h2.innerHTML = title.innerHTML.trim();
          textContentArr.push(h2);
        }
      }
      // Description
      const desc = contentSection.querySelector('.cmp-teaser__description');
      if (desc) {
        textContentArr.push(desc);
      }
      // CTA link, if present
      const cta = contentSection.querySelector('.cmp-teaser__action-link');
      if (cta) {
        textContentArr.push(cta);
      }
    }

    // Add slide row ONLY if we have an image (per block guidelines)
    if (imageEl) {
      cells.push([
        imageEl,
        textContentArr
      ]);
    }
  }

  // Create table and replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
