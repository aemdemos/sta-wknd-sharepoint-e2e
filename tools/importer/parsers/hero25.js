/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // 1. Header row
  const headerRow = ['Hero (hero25)'];

  // 2. Image row: Reference the actual <img> element
  let imageEl = null;
  const imageWrap = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrap) {
    const img = imageWrap.querySelector('img');
    if (img) imageEl = img;
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: Heading, subheading, CTA (NO <hr> in the cell)
  const contentEls = [];
  // Heading (use actual heading element)
  const heading = teaser.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  if (heading) {
    contentEls.push(heading);
  }
  // Subheading: Look for subtitle/description class or next paragraph
  const subtitle = teaser.querySelector('.cmp-teaser__subtitle, .cmp-teaser__description, p');
  if (subtitle && (!heading || subtitle !== heading)) {
    contentEls.push(subtitle);
  }
  // CTA: Look for anchor or button
  const cta = teaser.querySelector('a, button');
  if (cta) {
    contentEls.push(cta);
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
