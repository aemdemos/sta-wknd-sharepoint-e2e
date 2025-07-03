/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child with given class
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get cmp-teaser block (should be the first child)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image for row 2
  let imageEl = null;
  const teaserImageDiv = getDirectChildByClass(teaser, 'cmp-teaser__image');
  if (teaserImageDiv) {
    const imgWrap = teaserImageDiv.querySelector('[data-cmp-is="image"]');
    if (imgWrap) {
      imageEl = imgWrap.querySelector('img');
    }
  }

  // Get content for row 3
  const contentDiv = getDirectChildByClass(teaser, 'cmp-teaser__content');
  let contentParts = [];
  if (contentDiv) {
    // pretitle (optional)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      contentParts.push(pretitle);
    }
    // title (should be a heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      // Use as is (usually h2, but keep original element for semantic retention)
      contentParts.push(title);
    }
    // description (optional)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      contentParts.push(desc);
    }
    // CTA(s), if exist
    const actionContainer = contentDiv.querySelector('.cmp-teaser__action-container');
    if (actionContainer) {
      Array.from(actionContainer.children).forEach(child => {
        contentParts.push(child);
      });
    }
  }

  // Assemble table array
  const rows = [
    ['Hero (hero40)'], // header, exactly matches example
    [imageEl ? imageEl : ''], // background image row
    [contentParts.length ? contentParts : ''] // content row
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
