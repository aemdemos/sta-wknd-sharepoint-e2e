/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the main hero image: the first .cmp-image in the main top-level grid
  let heroImg = null;
  const firstGrid = element.querySelector('.cmp-container > .aem-Grid');
  if (firstGrid) {
    const imageDiv = firstGrid.querySelector('.cmp-image');
    if (imageDiv) {
      heroImg = imageDiv;
    }
  } else {
    // fallback: find first .cmp-image anywhere in top-level element
    const fallbackImg = element.querySelector('.cmp-image');
    if (fallbackImg) heroImg = fallbackImg;
  }

  // Extract the main title (h1)
  let title = null;
  const titleBlock = element.querySelector('.cmp-title h1');
  if (titleBlock) {
    title = titleBlock;
  }
  // Extract possible subheading (h4) - often author/byline
  let subtitle = null;
  const subtitleBlock = element.querySelector('.cmp-title h4');
  if (subtitleBlock) {
    subtitle = subtitleBlock;
  }

  // Compose the Hero block table
  // Row 1: Header
  const headerRow = ['Hero'];
  // Row 2: Background Image (optional)
  const imageRow = [heroImg ? heroImg : ''];
  // Row 3: Title (Heading), Subheading (optional)
  const textFragments = [];
  if (title) textFragments.push(title);
  if (subtitle) textFragments.push(subtitle);
  const textRow = [textFragments.length ? textFragments : ''];

  const cells = [
    headerRow,
    imageRow,
    textRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
