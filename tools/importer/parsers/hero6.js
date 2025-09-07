/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!heroTeaser) return;

  // Find the image block inside the hero teaser
  let imageCell = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find the content block (title, subheading, CTA)
  let title = '', subheading = '', cta = '';
  const contentWrapper = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    const h2 = contentWrapper.querySelector('h2, h1, h3, h4, h5, h6');
    if (h2) title = h2.outerHTML;
    // Subheading: look for a p or span after the heading
    let next = h2 ? h2.nextElementSibling : null;
    while (next) {
      if (next.tagName.toLowerCase() === 'p' || next.tagName.toLowerCase() === 'span') {
        subheading = next.outerHTML;
        break;
      }
      next = next.nextElementSibling;
    }
    // CTA: look for a link
    const link = contentWrapper.querySelector('a');
    if (link) cta = link.outerHTML;
  }

  // Compose the content cell for the third row
  let contentCell = '';
  if (title || subheading || cta) {
    contentCell = document.createElement('div');
    if (title) contentCell.insertAdjacentHTML('beforeend', title);
    if (subheading) contentCell.insertAdjacentHTML('beforeend', subheading);
    if (cta) contentCell.insertAdjacentHTML('beforeend', cta);
  }

  // Build the table rows (header, image, content)
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageCell ? imageCell : ''];
  const contentRow = [contentCell ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
