/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main cmp-container (hero block)
  let cmpContainer = element.querySelector('.cmp-container');
  if (!cmpContainer) cmpContainer = element; // fallback

  // Find the hero teaser block
  let heroTeaser = cmpContainer.querySelector('.cmp-teaser--hero') || cmpContainer.querySelector('.cmp-teaser');
  if (!heroTeaser) heroTeaser = cmpContainer;

  // Find the teaser image
  let imageEl = null;
  const teaserImageWrap = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (teaserImageWrap) {
    imageEl = teaserImageWrap.querySelector('img');
  }

  // Find the teaser content (title, subheading, CTA)
  let contentArr = [];
  const contentWrap = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentWrap) {
    // Title (heading)
    const title = contentWrap.querySelector('.cmp-teaser__title, h1, h2, h3');
    if (title) contentArr.push(title);
    // Add any subheading or CTA here if present in future variants.
  }

  // Table construction
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imageEl ? imageEl : '']; // empty string if no image
  const contentRow = [contentArr.length ? contentArr : '']; // empty string if no content

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
