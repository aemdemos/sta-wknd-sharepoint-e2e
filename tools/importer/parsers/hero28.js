/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the header row with the correct block name
  const headerRow = ['Hero (hero28)'];

  // Get the image element (background image)
  let imageElem = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageElem = img;
    }
  }

  // Gather content (title, description, CTA)
  const contentElems = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Title (usually h2)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) contentElems.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) contentElems.push(desc);
    // CTA (link)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) contentElems.push(cta);
  }

  // Construct the block table rows
  const tableData = [
    headerRow,
    [imageElem ? imageElem : ''],
    [contentElems.length ? contentElems : '']
  ];

  // Create and insert the table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
