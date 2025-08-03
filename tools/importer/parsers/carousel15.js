/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the carousel content
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slides (items)
  const items = content.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  // Assemble all rows after header
  const dataRows = [];
  items.forEach((item) => {
    // Left cell (image):
    let imageCell = '';
    const imageWrap = item.querySelector('.image');
    if (imageWrap) {
      const cmpImage = imageWrap.querySelector('.cmp-image');
      if (cmpImage) imageCell = cmpImage;
      else {
        const img = imageWrap.querySelector('img');
        if (img) imageCell = img;
      }
    } else {
      // fallback: search direct for cmp-image or img
      const cmpImage = item.querySelector('.cmp-image');
      if (cmpImage) imageCell = cmpImage;
      else {
        const img = item.querySelector('img');
        if (img) imageCell = img;
      }
    }
    // Right cell (text):
    const rightContent = [];
    Array.from(item.children).forEach((child) => {
      if (child.classList.contains('image')) return;
      if (child.classList.contains('cmp-image')) return;
      if (child.textContent.trim() || child.querySelector('a')) rightContent.push(child);
    });
    let rightCell = '';
    if (rightContent.length === 1) rightCell = rightContent[0];
    else if (rightContent.length > 1) rightCell = rightContent;
    // For slides with only images, right cell remains ''
    dataRows.push([imageCell, rightCell]);
  });

  // Prepare the cells array for createTable
  // Header row: single cell, to be set colspan=2 afterwards
  const cells = [['Carousel (carousel15)'], ...dataRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan on header cell if there is more than one column
  if (block && block.rows.length && block.rows[0].cells.length === 1 && dataRows[0] && dataRows[0].length > 1) {
    block.rows[0].cells[0].setAttribute('colspan', dataRows[0].length);
  }
  element.replaceWith(block);
}
