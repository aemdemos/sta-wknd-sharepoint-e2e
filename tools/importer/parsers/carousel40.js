/* global WebImporter */
export default function parse(element, { document }) {
  // --- Block name and header row ---
  const headerRow = ['Carousel (carousel40)'];

  // --- Extract slide image (first cell) ---
  // Prefer the <img> element directly if present
  let imageCell = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      imageCell = imageWrapper;
    }
  }

  // --- Extract text content (second cell) ---
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (contentWrapper) {
    // Featured label/pretitle (optional)
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textContent.push(pretitle);
    }
    // Title (as heading; use original element)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textContent.push(title);
    }
    // Description (optional)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // CTA link/button (optional)
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('.cmp-teaser__action-link');
      if (ctaLink) {
        textContent.push(ctaLink);
      }
    }
  }
  // If nothing found, ensure cell isn't empty (for robustness)
  if (textContent.length === 0) {
    textContent = [''];
  }

  // --- Build table rows ---
  const rows = [
    headerRow,           // Block header (single cell)
    [imageCell, textContent] // Slide row: image + text cell
  ];

  // --- Create and replace block table ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
