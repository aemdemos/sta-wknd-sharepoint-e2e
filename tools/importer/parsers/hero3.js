/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaserContainer = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  let imageEl = null;
  let titleEl = null;
  let subheadingEl = null;
  let ctaEl = null;

  if (teaserContainer) {
    // Find image
    const imageWrap = teaserContainer.querySelector('.cmp-teaser__image');
    if (imageWrap) {
      imageEl = imageWrap.querySelector('img');
    }
    // Find title
    const teaserContent = teaserContainer.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      titleEl = teaserContent.querySelector('h1, h2, h3, h4, h5, h6');
      // Find subheading (next sibling heading or paragraph)
      subheadingEl = titleEl && titleEl.nextElementSibling && (titleEl.nextElementSibling.matches('h2, h3, h4, h5, h6, p') ? titleEl.nextElementSibling : null);
      // Find CTA (first <a> in teaserContent)
      ctaEl = teaserContent.querySelector('a');
    }
  }

  const headerRow = ['Hero (hero3)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Compose third row cell
  const cellContent = [];
  if (titleEl) cellContent.push(titleEl);
  if (subheadingEl) cellContent.push(subheadingEl);
  if (ctaEl) cellContent.push(ctaEl);

  const contentRow = [cellContent.length ? cellContent : ''];

  const cells = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
