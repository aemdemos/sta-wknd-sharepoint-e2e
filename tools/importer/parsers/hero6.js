/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO (hero6) block ---
  // Table: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional)
  // Row 3: Title (heading), subheading (optional), CTA (optional)

  // Helper: find the hero image
  let heroImg = null;
  // Find the first image inside a .cmp-teaser__image or .cmp-image
  const teaserImageDiv = element.querySelector('.cmp-teaser__image, .cmp-image');
  if (teaserImageDiv) {
    heroImg = teaserImageDiv.querySelector('img');
  }
  // Defensive fallback: search for first img in the element
  if (!heroImg) {
    heroImg = element.querySelector('img');
  }

  // Helper: find the main heading
  let heroHeading = null;
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Prefer h1, then h2, then h3
    heroHeading = teaserContentDiv.querySelector('h1, h2, h3');
  }
  // Defensive fallback: first h1/h2/h3 in element
  if (!heroHeading) {
    heroHeading = element.querySelector('h1, h2, h3');
  }

  // Trim heading whitespace if present
  let headingCell = '';
  if (heroHeading) {
    // Clone and trim text
    const headingClone = heroHeading.cloneNode(true);
    headingClone.textContent = heroHeading.textContent.trim();
    headingCell = headingClone;
  }

  // Find <hr> separator after hero section
  let hr = null;
  const separator = element.querySelector('.cmp-separator__horizontal-rule, hr');
  if (separator) {
    hr = separator.cloneNode(true);
  }

  // Compose rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [heroImg ? heroImg : ''];
  // Third row: heading and separator (if present)
  const contentRow = hr ? [[headingCell, hr]] : [headingCell];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
