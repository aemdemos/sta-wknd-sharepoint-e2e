/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example
  const headerRow = ['Carousel (carousel22)'];
  // Find main carousel container
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  // Get all carousel slides
  const items = carouselRoot.querySelectorAll('.cmp-carousel__item');
  const rows = [headerRow];

  items.forEach(item => {
    // Find image - always first cell
    let imgEl = null;
    const teaserImageContainer = item.querySelector('.cmp-teaser__image');
    if (teaserImageContainer) {
      // Find the <img> inside this container
      const img = teaserImageContainer.querySelector('img');
      if (img) imgEl = img;
    }

    // Second cell: text content
    let textCell = [];
    // Title
    const teaserTitle = item.querySelector('.cmp-teaser__title');
    if (teaserTitle && teaserTitle.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = teaserTitle.textContent.trim();
      textCell.push(h2);
    }
    // Description (may be plain or HTML)
    const teaserDesc = item.querySelector('.cmp-teaser__description');
    if (teaserDesc) {
      if (teaserDesc.children && teaserDesc.children.length > 0) {
        Array.from(teaserDesc.children).forEach(child => {
          textCell.push(child);
        });
      } else if (teaserDesc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = teaserDesc.textContent.trim();
        textCell.push(p);
      }
    }
    // CTA link
    const teaserAction = item.querySelector('.cmp-teaser__action-link');
    if (teaserAction) {
      textCell.push(teaserAction);
    }
    // Only add row if image and some text content exist (as per example)
    if (imgEl && textCell.length > 0) {
      rows.push([imgEl, textCell]);
    }
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
