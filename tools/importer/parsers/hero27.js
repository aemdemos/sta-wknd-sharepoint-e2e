/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Hero (hero27)'];

  // --- Background image row ---
  // Find image as direct reference
  let imgEl = null;
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    imgEl = imageDiv.querySelector('img');
  }

  // --- Content row: Title, Description, CTA ---
  const contentDiv = element.querySelector('.cmp-teaser__content');
  // Use a fragment to collect content
  const contentFragment = document.createDocumentFragment();
  if (contentDiv) {
    // Title (should be a heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Use existing heading element for semantic meaning
      contentFragment.appendChild(title);
    }
    // Description (subheading or paragraph)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentFragment.appendChild(desc);
    }
    // CTA (link)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      contentFragment.appendChild(cta);
    }
  }

  // Compose table cells (1 col x 3 rows)
  const cells = [
    headerRow,                   // 1st row: Block name header
    [imgEl ? imgEl : ''],       // 2nd row: image or empty
    [contentFragment]           // 3rd row: content fragment (may be empty)
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
