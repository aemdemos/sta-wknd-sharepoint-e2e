/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Find main cmp-teaser within element (may not be top-level)
  let teaser = element;
  if (!element.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Find image (background image for hero)
  let imgEl = null;
  const imgContainer = teaser.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    const cmpImage = imgContainer.querySelector('.cmp-image');
    if (cmpImage) {
      imgEl = cmpImage.querySelector('img');
    }
  }

  // Compose content cell: pretitle, title, description, CTA (only if they exist)
  const content = teaser.querySelector('.cmp-teaser__content');
  const contentPieces = [];
  if (content) {
    // pretitle (e.g. "Featured Article")
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) contentPieces.push(pretitle);
    // title (usually h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) contentPieces.push(title);
    // description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) contentPieces.push(desc);
    // CTA (link)
    const ctaContainer = content.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink && ctaLink.textContent.trim()) contentPieces.push(ctaLink);
    }
  }
  // At least keep the structure with empty cells if some elements are missing

  // Build table rows as per block spec and example
  const rows = [];
  // Header row: block name (must match example exactly)
  rows.push(['Hero (hero40)']);
  // Second row: background/hero image (img element directly or empty string)
  rows.push([imgEl || '']);
  // Third row: content cell (array of found elements, even if empty)
  rows.push([contentPieces.length ? contentPieces : '']);

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
