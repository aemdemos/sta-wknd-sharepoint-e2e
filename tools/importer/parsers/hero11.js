/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root (the one with the image and heading)
  const heroTeaser = element.querySelector('.cmp-teaser--hero');
  let imgEl = null;
  let headingEl = null;

  if (heroTeaser) {
    // Find the image (inside .cmp-teaser__image)
    const imgContainer = heroTeaser.querySelector('.cmp-teaser__image img');
    if (imgContainer) {
      imgEl = imgContainer;
    }
    // Find the heading (inside .cmp-teaser__content)
    const contentContainer = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Accept any heading (h1-h6)
      const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        headingEl = heading;
      } else if (contentContainer.children.length > 0) {
        // fallback: use all content
        headingEl = Array.from(contentContainer.children);
      }
    }
  }

  // Build the table rows as per block description:
  // 1. Header row
  const headerRow = ['Hero (hero11)'];
  // 2. Image row (background image)
  const imageRow = [imgEl ? imgEl : ''];
  // 3. Content row (title, subheading, CTA)
  let contentCell = '';
  if (headingEl) {
    contentCell = Array.isArray(headingEl) ? headingEl : [headingEl];
  } else {
    contentCell = [''];
  }
  const contentRow = [contentCell];
  // 4. Always add a third row (for subheading/CTA), even if empty
  const thirdRow = [''];

  // Ensure exactly 3 rows: header, image, content
  const rows = [headerRow, imageRow, contentRow];

  // If rows length < 3, add empty rows to reach 3
  while (rows.length < 3) {
    rows.push(['']);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
