/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only operate on the main magazine grid
  if (!element.classList.contains('container')) return;

  const cells = [];
  // Header row as required
  const headerRow = ['Cards (cards4)'];
  cells.push(headerRow);

  // --- Featured Article Card ---
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (featuredTeaser) {
    const imgDiv = featuredTeaser.querySelector('.cmp-teaser__image .cmp-image');
    let imgEl = imgDiv && imgDiv.querySelector('img');
    // Defensive: fallback if not found
    if (!imgEl) imgEl = imgDiv;

    const contentDiv = featuredTeaser.querySelector('.cmp-teaser__content');
    // Compose text cell: pretitle, title, description, CTA
    const textParts = [];
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textParts.push(pretitle);
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) textParts.push(title);
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) textParts.push(desc);
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) textParts.push(cta);
    cells.push([imgEl, textParts]);
  }

  // --- All Articles Cards ---
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
      // Image
      const imgDiv = li.querySelector('.cmp-image-list__item-image .cmp-image');
      let imgEl = imgDiv && imgDiv.querySelector('img');
      if (!imgEl) imgEl = imgDiv;
      // Text: title, description
      const textParts = [];
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) textParts.push(titleSpan);
      }
      const desc = li.querySelector('.cmp-image-list__item-description');
      if (desc) textParts.push(desc);
      cells.push([imgEl, textParts]);
    });
  }

  // --- Members Only Cards ---
  // Find all teasers with 'cmp-teaser--list' and 'cmp-teaser--secure'
  const memberTeasers = element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure');
  memberTeasers.forEach((teaser) => {
    // Image
    const imgDiv = teaser.querySelector('.cmp-teaser__image .cmp-image');
    let imgEl = imgDiv && imgDiv.querySelector('img');
    if (!imgEl) imgEl = imgDiv;
    // Text: title, description, CTA
    const textParts = [];
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) textParts.push(title);
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) textParts.push(desc);
    // CTA: sometimes just text, sometimes a link
    const ctaContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) textParts.push(ctaContainer);
    cells.push([imgEl, textParts]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
