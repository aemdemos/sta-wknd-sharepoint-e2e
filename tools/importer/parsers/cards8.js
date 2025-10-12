/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a teaser block
  function extractTeaserCard(teaser) {
    // Image
    const imgWrap = teaser.querySelector('.cmp-teaser__image img');
    // Text content
    const pretitle = teaser.querySelector('.cmp-teaser__pretitle');
    const title = teaser.querySelector('.cmp-teaser__title');
    const desc = teaser.querySelector('.cmp-teaser__description');
    // CTA: look for a link in the action container
    let cta;
    const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      cta = actionContainer.querySelector('a');
      // If no link, but text exists, create a span
      if (!cta && actionContainer.textContent.trim()) {
        cta = document.createElement('span');
        cta.textContent = actionContainer.textContent.trim();
      }
    }
    // Compose text cell
    const textCell = [];
    if (pretitle) textCell.push(pretitle);
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    if (cta) textCell.push(cta);
    return [imgWrap, textCell];
  }

  // Helper to extract card content from image-list blocks
  function extractImageListCard(li) {
    // Image
    const img = li.querySelector('.cmp-image-list__item-image img');
    // Title (as link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const title = titleLink ? titleLink : li.querySelector('.cmp-image-list__item-title');
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    // Compose text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (desc) textCell.push(desc);
    return [img, textCell];
  }

  // Find all card sources
  const cards = [];

  // Featured card (teaser--featured)
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (featuredTeaser) {
    cards.push(extractTeaserCard(featuredTeaser));
  }

  // Image list cards
  const imageList = element.querySelector('.image-list ul.cmp-image-list');
  if (imageList) {
    imageList.querySelectorAll('li.cmp-image-list__item').forEach(li => {
      cards.push(extractImageListCard(li));
    });
  }

  // Member-only cards (teaser--list.cmp-teaser--secure)
  element.querySelectorAll('.teaser.cmp-teaser--list.cmp-teaser--secure .cmp-teaser').forEach(teaser => {
    cards.push(extractTeaserCard(teaser));
  });

  // Build table rows
  const headerRow = ['Cards (cards8)'];
  const tableRows = [headerRow];
  cards.forEach(card => {
    tableRows.push(card);
  });

  // Create table and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
