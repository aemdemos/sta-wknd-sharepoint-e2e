/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/featured teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--featured .cmp-teaser');
  if (!heroTeaser) return;

  // Extract the image element for the background image row (reference existing, do not clone)
  let heroImg = '';
  const img = heroTeaser.querySelector('.cmp-teaser__image img');
  if (img) heroImg = img;

  // Compose all relevant hero text content (reference existing nodes, do not clone)
  // We'll grab all direct children of .cmp-teaser__content
  let heroTextContent = [];
  const content = heroTeaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Collect all direct children (preserving order and structure)
    heroTextContent = Array.from(content.childNodes).filter((node) => {
      // Only keep elements or non-empty text nodes
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') return true;
      return false;
    });
    // If just one node, don't wrap as array (for createTable cell convenience)
    if (heroTextContent.length === 1) heroTextContent = heroTextContent[0];
  } else {
    heroTextContent = '';
  }

  // Build block table
  const cells = [
    ['Hero (hero4)'],
    [heroImg || ''],
    [heroTextContent],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
