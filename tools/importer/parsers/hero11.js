/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-teaser block inside the container
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // 1. Extract the background image (if any)
  let imageElem = null;
  const teaserImageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageWrapper) {
    const img = teaserImageWrapper.querySelector('img');
    if (img) {
      imageElem = img;
    }
  }

  // 2. Extract the heading (title) and any additional text
  const contentElems = [];
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Collect all direct children of content (in case of future subheading or CTA)
    Array.from(teaserContent.children).forEach(child => {
      contentElems.push(child);
    });
  }

  // Prepare the table rows according to block spec
  const rows = [];
  rows.push(['Hero (hero11)']);
  rows.push([imageElem ? imageElem : '']);
  rows.push([contentElems.length > 0 ? contentElems : '']);

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
