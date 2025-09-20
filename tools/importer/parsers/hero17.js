/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the cmp-teaser block (may be the same as element)
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Header row: always block name
  const headerRow = ['Hero (hero17)'];

  // --- Row 2: Background Image (optional) ---
  // Find the image element inside the teaser
  let imageCell = '';
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }
  // --- Row 3: Title, Subheading, CTA ---
  // Find content div
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  let contentCell = '';
  if (contentDiv) {
    // Collect title (h2), description (div), and any CTA (not present in this example)
    const parts = [];
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) parts.push(title);
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) parts.push(desc);
    // If there is a CTA (e.g. a link), add it (not present in this example)
    const cta = contentDiv.querySelector('a');
    if (cta) parts.push(cta);
    if (parts.length) {
      contentCell = parts;
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [contentCell],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
