/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero/teaser block
  let teaser = element.querySelector('.cmp-teaser--hero');
  if (!teaser) {
    // fallback: first .cmp-teaser in case structure changes
    teaser = element.querySelector('.cmp-teaser');
  }
  
  // 2. Get hero image (optional)
  let heroImg = null;
  if (teaser) {
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      heroImg = imgContainer.querySelector('img');
    }
  }

  // 3. Get hero heading (optional, usually h2 or h1 under .cmp-teaser__content)
  let heroHeading = null;
  if (teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      // find the first heading in order of importance
      heroHeading = content.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // 4. Compose hero block table (all rows are always present, even if cells are empty)
  const tableRows = [];
  // First row: block header as in the example
  tableRows.push(['Hero']);
  // Second row: image or empty string
  tableRows.push([heroImg ? heroImg : '']);
  // Third row: heading or empty string
  tableRows.push([heroHeading ? heroHeading : '']);

  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // 6. Replace the original element
  element.replaceWith(block);
}
