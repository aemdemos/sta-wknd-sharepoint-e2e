/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!heroTeaser) return;

  // Find background image (the main image in hero)
  let imageEl = null;
  const teaserImageWrap = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (teaserImageWrap) {
    imageEl = teaserImageWrap.querySelector('img');
  }

  // Find the content/title part of the hero
  let contentCellElements = [];
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Collect all direct children (headings, paragraphs, ctas, etc.)
    // This is more robust for future layout changes
    const children = Array.from(teaserContent.childNodes).filter(node => {
      // Only include element nodes with non-empty text, or text nodes with non-empty content
      return (node.nodeType === Node.ELEMENT_NODE && !!node.textContent.trim()) ||
             (node.nodeType === Node.TEXT_NODE && !!node.textContent.trim());
    });
    contentCellElements = children.length ? children : [];
  }

  // Compose the table as per the requirements (header, image, content)
  const cells = [
    ['Hero (hero11)'],
    [imageEl ? imageEl : ''],
    [contentCellElements.length ? contentCellElements : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
