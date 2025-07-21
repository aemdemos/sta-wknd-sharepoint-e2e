/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-container wrapper
  const container = element.querySelector('.cmp-container');
  if (!container) return;

  // Find the hero teaser block inside (contains image and title)
  const heroTeaser = container.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Get the image element (background)
  let backgroundImg = null;
  const teaserImageWrapper = heroTeaser.querySelector('.cmp-teaser__image');
  if (teaserImageWrapper) {
    const teaserImg = teaserImageWrapper.querySelector('img');
    if (teaserImg) {
      backgroundImg = teaserImg;
    }
  }

  // Get the main hero content (title)
  let contentCellContent = [];
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Include all direct children of the content div (should be heading, subheading, etc.)
    const contentNodes = Array.from(teaserContent.childNodes).filter(
      node => (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
    );
    if (contentNodes.length > 0) {
      contentCellContent = contentNodes;
    }
  }
  // The block expects an array or a single string/element in each cell
  const headerRow = ['Hero (hero23)'];
  const imageRow = [backgroundImg ? backgroundImg : ''];
  const contentRow = [contentCellContent.length ? contentCellContent : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
