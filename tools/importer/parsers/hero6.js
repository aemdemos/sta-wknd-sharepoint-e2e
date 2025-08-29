/* global WebImporter */
export default function parse(element, { document }) {
  // Component/Block: Hero (hero6)
  // Header row
  const headerRow = ['Hero (hero6)'];

  // Find .cmp-teaser (the hero section)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // --- Row 2: Background Image (optional) ---
  let bgImgEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    bgImgEl = imageWrapper.querySelector('img');
  }

  // --- Row 3: Title (heading), Subheading, CTA (optional) ---
  // For this example, only a heading exists.
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let contentEls = [];
  if (contentWrapper) {
    // Retain all block-level children (e.g., headings, paragraphs, etc.)
    // This allows flexibility for future subheadings, CTAs, etc.
    const children = Array.from(contentWrapper.childNodes).filter(
      node => node.nodeType === Node.ELEMENT_NODE
    );
    if (children.length) {
      contentEls = children;
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [bgImgEl || ''],
    [contentEls.length ? contentEls : '']
  ];

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
