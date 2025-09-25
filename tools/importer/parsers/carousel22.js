/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all carousel items
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each item contains a teaser
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image cell: find the first img inside teaser
    let imgEl = teaser.querySelector('.cmp-teaser__image img');
    // Defensive: fallback to any img in teaser
    if (!imgEl) imgEl = teaser.querySelector('img');

    // Text cell: build content block
    const textContent = document.createElement('div');
    // Title (h2)
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      // Use heading element directly
      textContent.appendChild(titleEl);
    }
    // Description (div or p)
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If description contains a <p>, use its children
      const descChildren = Array.from(descEl.childNodes);
      descChildren.forEach((node) => {
        textContent.appendChild(node);
      });
      // If no children, use as is
      if (descChildren.length === 0) {
        textContent.appendChild(descEl);
      }
    }
    // CTA link (optional)
    const ctaEl = teaser.querySelector('.cmp-teaser__action-link');
    if (ctaEl) {
      textContent.appendChild(ctaEl);
    }

    // Build row: [image, text]
    rows.push([
      imgEl ? imgEl : '',
      textContent.childNodes.length ? textContent : '',
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
