/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must be exactly 'Hero'
  const headerRow = ['Hero'];

  // 2. Find the main hero image at the very top of the page (the biggest most prominent image at the top)
  // This is usually the first .cmp-image img in the .cmp-container that comes first in the main container
  let heroImage = null;
  const topImageCandidate = element.querySelector('.cmp-container .cmp-image img');
  if (topImageCandidate) {
    heroImage = topImageCandidate;
  } else {
    // fallback: first .cmp-image img anywhere
    const anyImage = element.querySelector('.cmp-image img');
    if (anyImage) heroImage = anyImage;
  }

  // 3. Find the main heading (the main h1 at the top)
  let heroHeading = null;
  const h1Candidate = element.querySelector('h1');
  if (h1Candidate) {
    heroHeading = h1Candidate;
  }

  // 4. Build the table: header row + image row + heading row
  const rows = [
    headerRow,
    [heroImage || ''],
    [heroHeading || ''],
  ];

  // 5. Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element with this table
  element.replaceWith(table);
}
