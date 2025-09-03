/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if element exists
  if (!element) return;

  // Helper to extract teaser card info
  function parseTeaser(teaser) {
    // Find image
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    let imgEl = null;
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // Find text content
    const content = teaser.querySelector('.cmp-teaser__content');
    const textParts = [];
    if (content) {
      // Pretitle (optional)
      const pretitle = content.querySelector('.cmp-teaser__pretitle');
      if (pretitle) textParts.push(pretitle);
      // Title (h2)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) textParts.push(title);
      // Description
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) textParts.push(desc);
      // CTA
      const action = content.querySelector('.cmp-teaser__action-container');
      if (action) {
        // If action contains a link, use it, else use the text
        const link = action.querySelector('a');
        if (link) {
          textParts.push(link);
        } else if (action.textContent.trim()) {
          // Create a span for non-link CTA
          const span = document.createElement('span');
          span.textContent = action.textContent.trim();
          textParts.push(span);
        }
      }
    }
    return [imgEl, textParts];
  }

  // Helper to extract image-list card info
  function parseImageListItem(li) {
    // Find image
    const imgLink = li.querySelector('.cmp-image-list__item-image-link');
    let imgEl = null;
    if (imgLink) {
      imgEl = imgLink.querySelector('img');
    }
    // Find text content
    const textParts = [];
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) textParts.push(titleSpan);
    }
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) textParts.push(descSpan);
    return [imgEl, textParts];
  }

  // Find all teaser cards (featured + secure/list)
  const teaserCards = Array.from(element.querySelectorAll('.teaser.cmp-teaser--featured, .teaser.cmp-teaser--list'));
  // Find all image-list cards
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  const imageListCards = imageList ? Array.from(imageList.children) : [];

  // Compose all cards in order of appearance
  const cards = [];
  // Featured teaser (if present)
  if (teaserCards.length > 0) {
    // Only use the first featured teaser for the block
    const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
    if (featuredTeaser) {
      cards.push(parseTeaser(featuredTeaser));
    }
  }
  // Image-list cards
  imageListCards.forEach(li => {
    cards.push(parseImageListItem(li));
  });

  // Build table rows
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];
  cards.forEach(([img, textParts]) => {
    // Defensive: Only add if image and text
    if (img && textParts && textParts.length) {
      rows.push([img, textParts]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
