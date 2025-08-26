/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, EXACT match with example
  const headerRow = ['Hero (hero10)'];

  // 2. Row 2: Prominent image (background image)
  // Find the topmost image by scanning for .cmp-image from the top layout container
  let heroImage = null;
  const layoutContainer = element.querySelector('.cmp-layout-container--fixed') || element;
  const cmpImages = layoutContainer.querySelectorAll('.cmp-image img');
  if (cmpImages.length > 0) {
    heroImage = cmpImages[0];
  } else {
    // fallback: first image in the element
    heroImage = element.querySelector('img');
  }

  // 3. Row 3: Headline, Subheading, CTA, and ALL visible block text
  const row3Content = [];

  // Main headline (h1)
  const mainTitle = element.querySelector('h1');
  if (mainTitle) row3Content.push(mainTitle);

  // Subheading (h4 or byline)
  let subheading = element.querySelector('.cmp-title h4');
  if (!subheading) {
    // fallback: byline name
    subheading = element.querySelector('.cmp-byline__name');
  }
  if (subheading) row3Content.push(subheading);

  // CTA: prominent call-to-action link (Download PDF)
  const cta = element.querySelector('.cmp-download__title-link');
  if (cta) row3Content.push(cta);

  // Block content (for all main visible text)
  // Find the main article contentfragment in the primary column
  let mainContent = element.querySelector('article.cmp-contentfragment');
  if (mainContent) {
    row3Content.push(mainContent);
  }

  // Ensure all text content is included even if nested/divided
  // If not found, fallback to the first <main> if it contains visible content
  if (!mainContent) {
    const mainSection = element.querySelector('main');
    if (mainSection && mainSection.textContent.trim()) {
      row3Content.push(mainSection);
    }
  }

  // Compose the table rows
  const imageRow = [heroImage ? heroImage : ''];
  const contentRow = [row3Content.length ? row3Content : ''];
  const cells = [headerRow, imageRow, contentRow];

  // Create and replace with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
