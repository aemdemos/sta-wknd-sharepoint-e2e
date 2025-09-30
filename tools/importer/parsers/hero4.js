/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main grid container
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the featured teaser block (Hero)
  const featuredTeaser = grid.querySelector('.teaser.cmp-teaser--featured');
  if (!featuredTeaser) return;

  // --- Row 2: Background Image ---
  // Find the image inside the teaser
  let imageEl = null;
  const teaserImageWrap = featuredTeaser.querySelector('.cmp-teaser__image');
  if (teaserImageWrap) {
    imageEl = teaserImageWrap.querySelector('img');
  }

  // --- Row 3: Content ---
  // Find the teaser content
  const teaserContent = featuredTeaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (teaserContent) {
    // Collect all direct children (not just specific selectors)
    Array.from(teaserContent.children).forEach((child) => {
      // If it's an action container, try to get the link, otherwise include the container
      if (child.classList.contains('cmp-teaser__action-container')) {
        const ctaLink = child.querySelector('a');
        if (ctaLink) {
          contentEls.push(ctaLink);
        } else if (child.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = child.textContent.trim();
          contentEls.push(span);
        }
      } else {
        contentEls.push(child);
      }
    });
  }

  // --- Table Construction ---
  const headerRow = ['Hero (hero4)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
