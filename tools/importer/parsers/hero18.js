/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (first image in main container)
  let heroImg = null;
  const mainImages = element.querySelectorAll('.image');
  if (mainImages.length > 0) {
    heroImg = mainImages[0].querySelector('img');
  }
  if (!heroImg) {
    heroImg = element.querySelector('img');
  }

  // Find the main title (h1)
  let title = null;
  const h1 = element.querySelector('h1');
  if (h1) {
    title = h1;
  }

  // Find subheading (author/byline)
  let subheading = null;
  // Try h4 first, then byline name
  const h4 = element.querySelector('h4');
  if (h4) {
    subheading = h4;
  } else {
    const bylineName = element.querySelector('.cmp-byline__name');
    if (bylineName) {
      subheading = bylineName;
    }
  }

  // Find call-to-action (first prominent link, e.g. download PDF)
  let cta = null;
  // Try download button, then any .cmp-button
  const ctaLink = element.querySelector('.cmp-download__action a, .cmp-download__title-link');
  if (ctaLink) {
    cta = ctaLink;
  } else {
    const button = element.querySelector('.cmp-button');
    if (button) {
      cta = button;
    }
  }

  // Compose the content cell (title, subheading, cta)
  const contentCell = [];
  if (title) contentCell.push(title);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);

  // If subheading has occupation, add it as text
  const occupation = element.querySelector('.cmp-byline__occupations');
  if (occupation) {
    contentCell.push(document.createTextNode(occupation.textContent));
  }

  // Table rows
  const headerRow = ['Hero (hero18)'];
  const imageRow = [heroImg ? heroImg : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(block);
}
