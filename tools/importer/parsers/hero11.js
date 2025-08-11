/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name matches example exactly
  const headerRow = ['Hero (hero11)'];

  // 2. Second row: Background image (optional)
  // Look for .cmp-teaser--hero > .cmp-teaser > .cmp-teaser__image > [img]
  let imageEl = null;
  const heroTeaser = element.querySelector('.cmp-teaser--hero');
  if (heroTeaser) {
    const teaser = heroTeaser.querySelector('.cmp-teaser');
    if (teaser) {
      const teaserImage = teaser.querySelector('.cmp-teaser__image');
      if (teaserImage) {
        imageEl = teaserImage.querySelector('img');
      }
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Third row: Text content (title, subheading, CTA, etc.)
  // Look for .cmp-teaser--hero > .cmp-teaser > .cmp-teaser__content
  let contentEls = [];
  if (heroTeaser) {
    const teaser = heroTeaser.querySelector('.cmp-teaser');
    if (teaser) {
      const contentEl = teaser.querySelector('.cmp-teaser__content');
      if (contentEl) {
        // Take all child nodes that are elements, or non-empty text
        contentEls = Array.from(contentEl.childNodes).filter(node => {
          if (node.nodeType === Node.ELEMENT_NODE) return true;
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
          return false;
        });
      }
    }
  }
  const textRow = [contentEls.length ? contentEls : ''];

  // Table structure: header, image, text rows (1 col, 3 rows)
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
