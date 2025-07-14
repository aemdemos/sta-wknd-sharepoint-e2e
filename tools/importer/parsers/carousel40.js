/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getDirectChildByClass(el, className) {
    return Array.from(el.children).find(child => child.classList && child.classList.contains(className));
  }

  // Get .cmp-teaser__content (text content block)
  const content = element.querySelector('.cmp-teaser__content');
  // Get the image from .cmp-teaser__image
  const imageDiv = element.querySelector('.cmp-teaser__image');
  let img = null;
  if (imageDiv) {
    img = imageDiv.querySelector('img');
  }

  // Compose the text cell contents as an array, referencing existing elements (not clones)
  const textParts = [];
  if (content) {
    // Featured Article pretitle
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim().length > 0) textParts.push(pretitle);
    // Main Title (heading)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim().length > 0) textParts.push(title);
    // Description (paragraph)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim().length > 0) textParts.push(desc);
    // CTA (as link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim().length > 0) textParts.push(cta);
  }

  // Table header must EXACTLY match the example: 'Carousel (carousel40)'
  const cells = [
    ['Carousel (carousel40)'],
    [img, textParts]
  ];
  
  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
