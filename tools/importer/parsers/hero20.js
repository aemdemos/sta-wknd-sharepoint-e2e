/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image (if present)
  let imageDiv = element.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Extract the content (pretitles, heading, description, cta)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (contentDiv) {
    // Pretitle (like "Featured Article")
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle) contentEls.push(pretitle);
    // Title (as heading)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description (paragraph)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA link
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta) contentEls.push(cta);
  }

  // Table rows, matching the example
  const headerRow = ['Hero'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentEls.length ? contentEls : ''];

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(block);
}
