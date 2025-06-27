/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Get the image (Background Image)
  let imageEl = null;
  const teaserImageContainer = element.querySelector('.cmp-teaser__image');
  if (teaserImageContainer) {
    imageEl = teaserImageContainer.querySelector('img');
  }

  // 2. Get the content block (title, desc, cta)
  const content = element.querySelector('.cmp-teaser__content');
  // Prepare a container for all content (title, description, CTA)
  const contentContainer = document.createElement('div');
  if (content) {
    // Title (optional, styled as Heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      contentContainer.appendChild(title);
    }
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      contentContainer.appendChild(desc);
    }
    // CTA (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      contentContainer.appendChild(cta);
    }
  }

  // Build the block table
  // IMPORTANT: The table header row must match the example exactly: 'Hero' only (no styling or **)
  const tableRows = [
    ['Hero'],
    [imageEl || ''],
    [contentContainer],
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
