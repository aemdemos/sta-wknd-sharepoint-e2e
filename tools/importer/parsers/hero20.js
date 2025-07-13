/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row as per block name
  const headerRow = ['Hero (hero20)'];

  // --- Find Background Image (optional) ---
  // Look for the first .cmp-image img within element (the hero image at the top)
  let heroImg = null;
  const imgCandidates = element.querySelectorAll('.cmp-image img');
  if (imgCandidates.length > 0) {
    heroImg = imgCandidates[0];
  }

  // --- Find Title (Heading) and Subheading ---
  // Find the first h1 (title) and the first h4 (subheading) within element
  let heroTitle = null;
  let heroSubheading = null;
  const h1 = element.querySelector('h1');
  if (h1) heroTitle = h1;
  const h4 = element.querySelector('h4');
  if (h4) heroSubheading = h4;

  // --- Collect other relevant text for the hero (if any) ---
  // Per example, only h1 and h4 and not any paragraphs are included in the hero block's text row
  let textRowContent = [];
  if (heroTitle) textRowContent.push(heroTitle);
  if (heroSubheading) textRowContent.push(heroSubheading);

  // Ensure at least one of the above is present (otherwise, cell is empty string)
  const textRow = [textRowContent.length > 0 ? textRowContent : ''];

  // Image row: image in its own row, or empty string if not found
  const imageRow = [heroImg ? heroImg : ''];

  // Final cells: header row, image row, text row
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
