/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from teaser blocks
  function extractTeaserCard(teaserDiv) {
    // Image
    const imageWrapper = teaserDiv.querySelector('.cmp-teaser__image .cmp-image');
    let imgEl = null;
    if (imageWrapper) {
      imgEl = imageWrapper.querySelector('img');
    }
    // Text content
    const contentDiv = teaserDiv.querySelector('.cmp-teaser__content');
    let pretitleEl = contentDiv && contentDiv.querySelector('.cmp-teaser__pretitle');
    let titleEl = contentDiv && contentDiv.querySelector('.cmp-teaser__title');
    let descEl = contentDiv && contentDiv.querySelector('.cmp-teaser__description');
    let ctaContainer = contentDiv && contentDiv.querySelector('.cmp-teaser__action-container');
    let ctaEl = null;
    if (ctaContainer) {
      ctaEl = ctaContainer.querySelector('a');
      // If no link, but text exists, create a span
      if (!ctaEl && ctaContainer.textContent.trim()) {
        ctaEl = document.createElement('span');
        ctaEl.textContent = ctaContainer.textContent.trim();
      }
    }
    // Compose text cell
    const textCell = [];
    if (pretitleEl) textCell.push(pretitleEl);
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    if (ctaEl) textCell.push(ctaEl);
    return [imgEl, textCell];
  }

  // Helper to extract card info from image-list blocks
  function extractImageListCard(li) {
    // Image
    const imgEl = li.querySelector('img');
    // Title (as heading)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = titleLink && titleLink.querySelector('.cmp-image-list__item-title');
    let titleEl = null;
    if (titleSpan) {
      titleEl = document.createElement('h3');
      titleEl.textContent = titleSpan.textContent.trim();
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descSpan) textCell.push(descSpan);
    return [imgEl, textCell];
  }

  // Helper for lock icon
  function createLockIcon() {
    const span = document.createElement('span');
    span.textContent = '🔒';
    span.style.marginRight = '4px';
    return span;
  }

  // Find all card sources
  const cells = [];
  // Header row
  cells.push(['Cards (cards4)']);

  // Featured Article card (teaser)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    cells.push(extractTeaserCard(featuredTeaser));
  }

  // Article cards (image-list)
  const imageList = element.querySelector('.image-list .cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll(':scope > li').forEach((li) => {
      cells.push(extractImageListCard(li));
    });
  }

  // Members Only cards (teaser--list)
  const memberTeasers = element.querySelectorAll('.teaser.cmp-teaser--list .cmp-teaser');
  memberTeasers.forEach((teaser) => {
    const card = extractTeaserCard(teaser);
    // Add lock icon to text cell
    card[1].unshift(createLockIcon());
    cells.push(card);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
