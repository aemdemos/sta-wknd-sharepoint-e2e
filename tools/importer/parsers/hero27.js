/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block Header: matches example exactly
  const headerRow = ['Hero (hero27)'];

  // Defensive: locate the main cmp-teaser block
  const teaser = element.querySelector(':scope > div.cmp-teaser');
  if (!teaser) {
    // If not found, do nothing
    return;
  }

  // 2. Image row: extract image element (or fallback if unavailable)
  let imageCell = '';
  const teaserImageWrap = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageWrap) {
    // Try to find direct <img> (prefer this)
    const img = teaserImageWrap.querySelector('img');
    if (img) {
      imageCell = img;
    } else {
      // Fallback, use the entire image wrapper if no img found
      imageCell = teaserImageWrap;
    }
  }

  // 3. Content row: Heading, Description, CTA
  const contentArr = [];
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Find title (typically <h2>)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) contentArr.push(title);

    // Find description (typically <div>)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) contentArr.push(desc);

    // Find CTA (typically <a> in .cmp-teaser__action-container)
    const ctaContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      const cta = ctaContainer.querySelector('a');
      if (cta) contentArr.push(cta);
    }
  }

  // Assemble table data: header, image, content
  const cells = [
    headerRow,                                 // 1st row: header
    [imageCell],                              // 2nd row: image
    [contentArr.length > 0 ? contentArr : ''] // 3rd row: text & CTA
  ];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
