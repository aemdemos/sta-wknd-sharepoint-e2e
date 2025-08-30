/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block: header row, 1 card row with image + text content

  // Get the image element (mandatory)
  let img = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    img = imageWrapper.querySelector('img');
  }

  // Get the text content elements
  const content = element.querySelector('.cmp-teaser__content');
  const cellContent = [];

  if (content) {
    // Featured Article pretitle (optional)
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) cellContent.push(pretitle);
    // Title (mandatory)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) cellContent.push(title);
    // Description (optional)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) cellContent.push(desc);
    // CTA link (optional)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) cellContent.push(cta);
  }

  // Table structure: header row, card row [img, text content]
  const headerRow = ['Cards (cards20)'];
  const cardRow = [img, cellContent];
  const rows = [headerRow, cardRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
