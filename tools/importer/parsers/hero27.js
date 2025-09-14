/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content and image wrappers
  const teaserContent = Array.from(element.querySelectorAll(':scope > div > .cmp-teaser__content'))[0];
  const teaserImageWrap = Array.from(element.querySelectorAll(':scope > div > .cmp-teaser__image'))[0];

  // Get the image element (background image)
  let imageEl = null;
  if (teaserImageWrap) {
    // Find the first <img> inside the image wrapper
    imageEl = teaserImageWrap.querySelector('img');
  }

  // Compose the content cell: title, description, CTA
  let contentEls = [];
  if (teaserContent) {
    // Title (h2)
    const titleEl = teaserContent.querySelector('.cmp-teaser__title');
    if (titleEl) contentEls.push(titleEl);
    // Description (div)
    const descEl = teaserContent.querySelector('.cmp-teaser__description');
    if (descEl) contentEls.push(descEl);
    // CTA (link)
    const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const ctaLink = ctaContainer.querySelector('a');
      if (ctaLink) contentEls.push(ctaLink);
    }
  }

  // Table rows
  const headerRow = ['Hero (hero27)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
