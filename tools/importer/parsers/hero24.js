/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find hero image
  function findHeroImage(el) {
    // Look for .cmp-teaser__image or any img inside
    const imgWrapper = el.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) return img;
    }
    // Fallback: any img inside element
    const img = el.querySelector('img');
    return img || null;
  }

  // Helper: Find hero headline
  function findHeroHeadline(el) {
    // Look for .cmp-teaser__title or first h1/h2/h3
    const headline = el.querySelector('.cmp-teaser__title, h1, h2, h3');
    return headline || null;
  }

  // Find separator (hr)
  function findSeparator(el) {
    const hr = el.querySelector('hr');
    return hr || null;
  }

  // Compose block rows
  const headerRow = ['Hero (hero24)'];

  // Row 2: Image
  const heroImg = findHeroImage(element);
  const imageRow = [heroImg ? heroImg : ''];

  // Row 3: Headline and separator
  const headline = findHeroHeadline(element);
  const hr = findSeparator(element);
  // Compose content cell
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (hr) contentCell.push(hr);

  const contentRow = [contentCell.length ? contentCell : ''];

  // Assemble table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with table
  element.replaceWith(table);
}
