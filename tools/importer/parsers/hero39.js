/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name as required
  const headerRow = ['Hero (hero39)'];

  // 2. Image row: Find the main hero image
  let imgCell = '';
  const teaserImageWrap = element.querySelector('.cmp-teaser__image');
  if (teaserImageWrap) {
    const img = teaserImageWrap.querySelector('img');
    if (img) {
      imgCell = img;
    }
  }

  // 3. Content row: Headline, subheading, CTA if present
  let contentElements = [];
  const teaserContent = element.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Get all direct children of .cmp-teaser__content so we don't miss any headings, paragraphs, etc.
    const directContent = Array.from(teaserContent.children);
    directContent.forEach((el) => {
      if (el.tagName === 'H2' || el.tagName === 'H1' || el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6') {
        contentElements.push(el);
      } else if (el.classList.contains('cmp-teaser__description')) {
        // Description may contain paragraphs
        Array.from(el.childNodes).forEach((descChild) => {
          if (descChild.nodeType === 1) {
            contentElements.push(descChild);
          }
        });
      } else {
        // fallback: add anything else directly
        contentElements.push(el);
      }
    });
  }

  // Edge case: ensure at least an empty cell if nothing found
  if (contentElements.length === 0) {
    contentElements = [''];
  }

  // Build table data
  const cells = [
    headerRow,
    [imgCell],
    [contentElements]
  ];

  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
