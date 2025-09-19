/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!heroTeaser) return;

  // Find the image element (background image)
  let imageEl = '';
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // Collect title, subheading, and CTA (if present) into a single cell (no extra wrapper)
  const content = heroTeaser.querySelector('.cmp-teaser__content');
  const contentCell = [];
  if (content) {
    // Title
    const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentCell.push(heading.cloneNode(true));
    // Subheading: h3, h4, p (not the heading)
    const subheadings = Array.from(content.querySelectorAll('h3, h4, p'));
    subheadings.forEach(sub => {
      if (!heading || sub !== heading) {
        contentCell.push(sub.cloneNode(true));
      }
    });
    // CTA: all links
    const ctas = Array.from(content.querySelectorAll('a'));
    ctas.forEach(cta => contentCell.push(cta.cloneNode(true)));
  }
  // Always provide a cell for the third row (even if empty)
  const contentRow = [contentCell.length ? contentCell : ''];

  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl];

  // Ensure there are always exactly 3 rows (header, image, content)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
