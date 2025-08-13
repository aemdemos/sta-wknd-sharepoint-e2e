/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: block/component name exactly as in example
  const headerRow = ['Hero (hero39)'];

  // 2. Find image - must reference the actual <img> element (not clone or create new)
  let imageElem = null;
  // Find .cmp-teaser__image as direct child of the teaser block
  const teaserMain = element.querySelector(':scope > div');
  if (teaserMain) {
    const imageWrapper = teaserMain.querySelector('.cmp-teaser__image');
    if (imageWrapper) {
      imageElem = imageWrapper.querySelector('img');
    }
  }

  // 3. Find content elements (title, description, call-to-action if present)
  let contentElems = [];
  if (teaserMain) {
    const contentWrapper = teaserMain.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      // Title (usually h2)
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) contentElems.push(title);
      // Description (optional, div or p)
      const descDiv = contentWrapper.querySelector('.cmp-teaser__description');
      if (descDiv) contentElems.push(descDiv);
      // If there is a CTA (e.g., a link), include it in semantic order
      // For this HTML, there isn't, but code can handle it for generality
      const cta = contentWrapper.querySelector('a');
      if (cta) contentElems.push(cta);
    }
  }

  // 4. Construct table rows as per spec
  const cells = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentElems.length > 0 ? contentElems : '']
  ];

  // 5. Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
  // No Section Metadata in the example; no <hr> or other blocks
}
