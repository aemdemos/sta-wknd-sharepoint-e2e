/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the hero/teaser block (the actual content block)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract background image (if present)
  let heroImage = null;
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      heroImage = img;
    }
  }

  // Extract content (title, subtitle, CTA, etc.)
  const contentContainer = teaser.querySelector('.cmp-teaser__content');
  let contentElements = [];
  if (contentContainer) {
    // Get all content children
    contentElements = Array.from(contentContainer.children).filter(e => e.textContent.trim() !== '');
  }

  // Compose the cell structure for the hero11 block
  const cells = [
    ['Hero (hero11)'],
    [heroImage ? heroImage : ''],
    [contentElements.length ? contentElements : '']
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original hero section root with the new block table
  element.replaceWith(block);
}
