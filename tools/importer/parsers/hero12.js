/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser--hero block
  const heroBlock = element.querySelector('.cmp-teaser--hero');
  if (!heroBlock) return;

  // Find the background image
  let imgEl = null;
  const teaserImg = heroBlock.querySelector('.cmp-teaser__image img');
  if (teaserImg) {
    imgEl = teaserImg;
  }

  // Find the title (heading) in the hero
  let titleEl = null;
  const teaserTitle = heroBlock.querySelector('.cmp-teaser__content > .cmp-teaser__title');
  if (teaserTitle) {
    titleEl = teaserTitle;
  }

  // Table structure: header, image row, content row
  const rows = [];
  rows.push(['Hero (hero12)']);
  rows.push([imgEl ? imgEl : '']);
  rows.push([titleEl ? titleEl : '']);

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
