/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell per requirements
  const cells = [ ['Carousel (carousel40)'] ];

  // Find the .cmp-teaser inside the element
  const cmpTeaser = element.querySelector('.cmp-teaser');
  if (!cmpTeaser) return;

  // Get the image (first cell of slide row)
  let imageCell = '';
  const teaserImgWrap = cmpTeaser.querySelector('.cmp-teaser__image');
  if (teaserImgWrap) {
    const teaserImg = teaserImgWrap.querySelector('img');
    if (teaserImg) {
      imageCell = teaserImg;
    }
  }

  // Get text content for the slide (second cell)
  let textCell = '';
  const textContentArr = [];
  const teaserContent = cmpTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Pretitle
    const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContentArr.push(pretitle);
    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) textContentArr.push(title);
    // Description
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) textContentArr.push(desc);
    // CTA(s)
    const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      const links = Array.from(actionContainer.querySelectorAll('a'));
      links.forEach((link) => textContentArr.push(link));
    }
    if (textContentArr.length > 0) textCell = textContentArr;
  }

  // Add the slide row as a 2-column row (image, text)
  cells.push([imageCell, textCell]);

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
