/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Table header row (block name)
  const headerRow = ['Table (striped, bordered, tableStripedBordered6)'];
  const rows = [headerRow];

  // For each carousel item, extract title, description, and CTA link
  items.forEach((item) => {
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;
    // Title
    let title = '';
    const titleEl = teaser.querySelector('.cmp-teaser__title');
    if (titleEl) {
      title = titleEl.textContent.trim();
    }
    // Description
    let desc = '';
    const descEl = teaser.querySelector('.cmp-teaser__description');
    if (descEl) {
      desc = descEl.textContent.trim();
    }
    // CTA link
    let linkHref = '';
    let linkText = '';
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      linkHref = cta.href;
      linkText = cta.textContent.trim();
    }
    // Build link element
    let linkEl = '';
    if (linkHref) {
      linkEl = document.createElement('a');
      linkEl.href = linkHref;
      linkEl.textContent = linkText || linkHref;
    }
    // Add row (no sub-header, just data rows after headerRow)
    rows.push([title, desc, linkEl || '']);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
