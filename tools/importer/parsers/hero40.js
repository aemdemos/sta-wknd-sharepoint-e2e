/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Hero (hero40)'];

  // Extract background image (row 2)
  const imageContainer = element.querySelector('.cmp-teaser__image');
  let imageElem = null;
  if (imageContainer) {
    imageElem = imageContainer.querySelector('img');
  }
  const row2 = [imageElem].filter(Boolean);

  // Build content cell (row 3)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const contentArr = [];
  if (contentContainer) {
    // Pretitle (as subheading, usually small text)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentArr.push(pretitle);
    }
    // Title (as heading, use h2 from source)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      contentArr.push(title);
    }
    // Description (as paragraph)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      // Wrap in <p> if not already
      let descElem = desc;
      if (desc.tagName.toLowerCase() !== 'p') {
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        descElem = p;
      }
      contentArr.push(descElem);
    }
    // CTA (as link)
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      contentArr.push(cta);
    }
  }

  const row3 = [contentArr];

  // Rows: header, image, content
  const rows = [headerRow];
  if (row2.length > 0) rows.push(row2);
  rows.push(row3);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
