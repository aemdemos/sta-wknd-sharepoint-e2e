/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  let imageEl = null;
  let contentEls = [];

  if (heroTeaser) {
    // Find image element inside teaser
    const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image');
    if (imageWrapper) {
      imageEl = imageWrapper.querySelector('img');
    }
    // Find content elements inside teaser
    const contentWrapper = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentWrapper) {
      // Collect all heading, subheading, and CTA elements (if present)
      // For this sample, only heading is present
      const heading = contentWrapper.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && heading.textContent) {
        const trimmed = heading.textContent.trim();
        const headingEl = document.createElement(heading.tagName.toLowerCase());
        headingEl.textContent = trimmed;
        contentEls.push(headingEl);
      }
      // If there were subheading or CTA, add them here as well
    }
  }

  // Table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
