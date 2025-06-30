/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the inner .cmp-teaser block (could be direct or with wrappers)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) {
    // fallback - if .cmp-teaser not found, do nothing
    return;
  }

  // 1. Get background image (may be absent)
  let imageEl = null;
  const imageContainer = teaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 2. Gather content block elements
  const content = teaser.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (content) {
    // pretitle (e.g., Featured Article)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) contentEls.push(pretitle);
    // title
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) contentEls.push(title);
    // description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) contentEls.push(desc);
    // CTA link (may be inside action container)
    const action = content.querySelector('.cmp-teaser__action-container');
    if (action) {
      const link = action.querySelector('a');
      if (link) contentEls.push(link);
    }
  }

  // 3. Table structure: header row, image row, content row
  const cells = [
    ['Hero (hero40)'],
    [imageEl ? imageEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  // 4. Create and insert block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
