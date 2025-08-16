/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches example exactly
  const headerRow = ['Hero (hero11)'];

  // 2. Extract the background image from cmp-teaser__image
  let backgroundImg = null;
  const cmpTeaserImage = element.querySelector('.cmp-teaser__image');
  if (cmpTeaserImage) {
    const img = cmpTeaserImage.querySelector('img');
    if (img) {
      backgroundImg = img;
    }
  }
  // Edge case: fallback to any img inside element
  if (!backgroundImg) {
    backgroundImg = element.querySelector('img');
  }
  const imageRow = [backgroundImg ? backgroundImg : ''];

  // 3. Extract the title (as heading), subheading, CTA (if available)
  const contentArr = [];
  // Title (h2)
  const title = element.querySelector('.cmp-teaser__title');
  if (title) {
    contentArr.push(title);
  }
  // Subheading, CTA: not present in provided HTML, but support cmp-teaser__description and links/buttons as optional
  const description = element.querySelector('.cmp-teaser__description');
  if (description) {
    contentArr.push(description);
  }
  // CTA: .cmp-teaser__action-link, <a>, <button>
  const ctas = element.querySelectorAll('.cmp-teaser__action-link, a, button');
  ctas.forEach(cta => {
    // Avoid duplicates
    if (!contentArr.includes(cta)) {
      contentArr.push(cta);
    }
  });
  const contentRow = [contentArr.length ? contentArr : ''];

  // 4. Compose block table: 1 column, 3 rows, with header in first row
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the original element
  element.replaceWith(block);
}
