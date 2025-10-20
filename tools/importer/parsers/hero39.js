/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero39) block parsing
  // Table: 1 column, 3 rows

  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Image row
  // Find the image element inside the hero block
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }
  // Defensive fallback: if not found, search for any img
  if (!imageEl) {
    imageEl = element.querySelector('img');
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row (heading, subheading, CTA)
  const content = [];
  // Heading
  const headingEl = element.querySelector('.cmp-teaser__title, h1, h2, h3');
  if (headingEl) {
    content.push(headingEl);
  }
  // Subheading/description
  const descEl = element.querySelector('.cmp-teaser__description');
  if (descEl) {
    // If description is a container, extract its children
    if (descEl.children.length) {
      for (const child of descEl.children) {
        content.push(child);
      }
    } else {
      content.push(descEl);
    }
  }
  // CTA (call-to-action): look for a link inside the hero block
  let ctaEl = null;
  // Search for anchor tags that could be CTA
  const possibleCtas = element.querySelectorAll('a[href]');
  if (possibleCtas.length) {
    // Use the first anchor as CTA
    ctaEl = possibleCtas[0];
    content.push(ctaEl);
  }
  // Content row: combine all content elements
  const contentRow = [content.length ? content : ''];

  // Compose table rows
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
