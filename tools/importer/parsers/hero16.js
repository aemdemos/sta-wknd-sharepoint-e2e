/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the table as per the Hero (hero16) block example
  // Header row: exact string
  const headerRow = ['Hero (hero16)'];

  // Row 2: background image (first hero image at the top)
  // Look for the first .cmp-image inside the top-level .cmp-container > .aem-Grid
  let heroImg = null;
  const heroImageEl = element.querySelector(
    '.cmp-container > .aem-Grid > .image .cmp-image'
  );
  if (heroImageEl) heroImg = heroImageEl;

  // Row 3: Title (h1), subheading (h4), and intro text (first <p> of the main article)
  // We'll look for all .cmp-title > h1 (main title), .cmp-title > h4 (subheading), and first <p> in main contentfragment
  const textContent = [];
  // Title
  const h1 = element.querySelector('.cmp-container .cmp-title h1');
  if (h1) textContent.push(h1);
  // Subheading (if present)
  const h4 = element.querySelector('.cmp-container .cmp-title h4');
  if (h4) textContent.push(h4);
  // First p in cmp-contentfragment (main article intro)
  const cf = element.querySelector('.cmp-contentfragment');
  let firstP = null;
  if (cf) {
    firstP = cf.querySelector('p');
    if (firstP) textContent.push(firstP);
  }

  // Compose the rows
  const rows = [
    headerRow,
    [heroImg ? heroImg : ''],
    [textContent]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
