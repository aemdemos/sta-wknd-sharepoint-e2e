/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/teaser block (looks for .cmp-teaser--hero)
  const heroDiv = element.querySelector('.cmp-teaser--hero');
  if (!heroDiv) return;

  // Find the teaser content block
  const cmpTeaser = heroDiv.querySelector('.cmp-teaser');
  if (!cmpTeaser) return;

  // Extract background image (img)
  let imgEl = null;
  const teaserImage = cmpTeaser.querySelector('.cmp-teaser__image .cmp-image img');
  if (teaserImage) {
    imgEl = teaserImage;
  }

  // Extract content block children (title, subheading, CTA)
  let contentEls = [];
  const teaserContent = cmpTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent && teaserContent.children.length) {
    contentEls = Array.from(teaserContent.children);
  }
  
  // Compose rows: header, image, content
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
