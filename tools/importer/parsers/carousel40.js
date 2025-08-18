/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches spec
  const headerRow = ['Carousel (carousel40)'];

  // 2. Extract slide image (first cell)
  let imageCell = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // 3. Extract text content (second cell)
  let textCellContent = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Pretitle, if present (typically a <p>)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textCellContent.push(pretitle);
    }
    // Title (typically an <h2>)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textCellContent.push(title);
    }
    // Description (could be <div> or <p>)
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textCellContent.push(desc);
    }
    // CTA link, if present
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textCellContent.push(cta);
    }
  }
  // Only array if more than one element, else single element
  const textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

  // 4. Construct table rows
  const rows = [headerRow];
  // Only add a slide row if we have at least one of image or text
  if (imageCell || textCellContent.length > 0) {
    rows.push([imageCell, textCell]);
  }

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
