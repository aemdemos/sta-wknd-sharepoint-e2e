/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with block name exactly as given
  const headerRow = ['Hero (hero28)'];

  // 2. Image row - single cell with the <img> element if present
  let imageRow = [null];
  const teaserImage = element.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageRow = [teaserImage];
  }

  // 3. Content row: Title (as heading), Description (as paragraph), CTA (as link)
  const contentParts = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Title
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) contentParts.push(title);
    // Description (ensure inside a paragraph for proper structure)
    const desc = teaserContent.querySelector('.cmp-teaser__description');
    if (desc) {
      if (desc.tagName.toLowerCase() === 'p') {
        contentParts.push(desc);
      } else {
        // If not a <p>, wrap it
        const p = document.createElement('p');
        p.innerHTML = desc.innerHTML;
        contentParts.push(p);
      }
    }
    // CTA Link (if any)
    const cta = teaserContent.querySelector('.cmp-teaser__action-link');
    if (cta) contentParts.push(cta);
  }
  const contentRow = [contentParts];

  // Compile the rows
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
