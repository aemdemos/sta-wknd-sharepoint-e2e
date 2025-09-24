/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // Find the cmp-teaser inside the block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image (mandatory, first cell)
  const imageWrapper = getChildByClass(teaser, 'cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    // Find the first img inside cmp-teaser__image
    imageEl = imageWrapper.querySelector('img');
  }

  // Get content (second cell)
  const contentWrapper = getChildByClass(teaser, 'cmp-teaser__content');
  let contentCell = [];
  if (contentWrapper) {
    // Optional pretitle
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentCell.push(pretitle);

    // Optional title (as heading)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) contentCell.push(title);

    // Optional description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) contentCell.push(desc);

    // Optional CTA (action link)
    const actionContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const cta = actionContainer.querySelector('a');
      if (cta) contentCell.push(cta);
    }
  }

  // Build table rows
  const headerRow = ['Carousel (carousel40)'];
  const slideRow = [imageEl, contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    slideRow,
  ], document);

  element.replaceWith(table);
}
