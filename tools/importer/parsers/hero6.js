/* global WebImporter */
export default function parse(element, { document }) {
  // === 1. The header row ===
  const headerRow = ['Hero (hero6)']; // Matches the example header exactly

  // === 2. The Background Image row ===
  // Look for the promo/teaser image in .cmp-teaser__image, and use the <img> reference directly
  let imgEl = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const teaserImgContainer = teaser.querySelector('.cmp-teaser__image');
    if (teaserImgContainer) {
      imgEl = teaserImgContainer.querySelector('img');
    }
  }
  // Fallback: first <img> in the element
  if (!imgEl) {
    imgEl = element.querySelector('img');
  }
  // If not found, leave cell empty
  const imageRow = [imgEl ? imgEl : ''];

  // === 3. The Hero Content row (title, subheading, CTA) ===
  // In this HTML, only a single heading in .cmp-teaser__title is present
  // Content may be more than just the heading in other cases, so we handle possible subtitle and CTA
  let contentEls = [];
  if (teaser) {
    // Title (usually h2.cmp-teaser__title)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      contentEls.push(titleEl);
    }
    // Subheading (optional, e.g. .cmp-teaser__subtitle)
    const subheadingEl = teaser.querySelector('.cmp-teaser__subtitle');
    if (subheadingEl) {
      contentEls.push(subheadingEl);
    }
    // Call-to-Action (optional, button or link)
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link a, .cmp-teaser__action-link button');
    if (ctaEl) {
      contentEls.push(ctaEl);
    }
  }
  // Fallback: any <h1>, <h2>, <h3>, <p> inside teaser
  if (contentEls.length === 0 && teaser) {
    ['h1', 'h2', 'h3', 'p'].forEach(tag => {
      teaser.querySelectorAll(tag).forEach(el => contentEls.push(el));
    });
  }
  // Final fallback: look in whole element for headings or paragraphs
  if (contentEls.length === 0) {
    ['h1', 'h2', 'h3', 'p'].forEach(tag => {
      element.querySelectorAll(tag).forEach(el => contentEls.push(el));
    });
  }
  // If still empty, leave cell empty
  const contentRow = [contentEls.length ? contentEls : ''];

  // === 4. Assemble the block table ===
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // === 5. Replace the original block ===
  element.replaceWith(blockTable);
}
