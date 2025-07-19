/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser element inside the wrapper
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Left column: image
  let imageElem = null;
  const teaserImage = teaser.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    imageElem = teaserImage.querySelector('img');
  }

  // Right column: text block (pretitle, title, description, CTA)
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  const textColElems = [];
  if (teaserContent) {
    const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) textColElems.push(pretitle);
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) textColElems.push(title);
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) textColElems.push(desc);
    const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const actionLink = actionContainer.querySelector('a');
      if (actionLink) textColElems.push(actionLink);
    }
  }

  // Columns block: 1 header cell, then 1 row with two columns
  const tableRows = [
    ['Columns (columns40)'], // Header row: exactly one cell
    [imageElem, textColElems] // Content row: two cells
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
