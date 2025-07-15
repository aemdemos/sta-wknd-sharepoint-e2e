/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare an array for rows; header row will be padded to match column count
  let rows = [];

  // Find carousel content
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build slide rows, each as [image, text]
  const slideRows = items.map((item) => {
    // First image in the slide
    const imgEl = item.querySelector('img');
    // All direct children that are not image/image wrapper
    const textElems = [];
    Array.from(item.children).forEach((child) => {
      if (
        child.tagName === 'IMG' ||
        (child.classList && (child.classList.contains('image') || child.classList.contains('cmp-image')))
      ) {
        return;
      }
      textElems.push(child);
    });
    const textContent = textElems.length > 0 ? textElems : '';
    return [imgEl, textContent];
  });

  // Determine col count: always 2 for carousel
  const colCount = 2;
  // Pad header row to match col count
  const headerRow = ['Carousel (carousel18)'];
  while (headerRow.length < colCount) headerRow.push('');
  rows.push(headerRow);
  rows = rows.concat(slideRows);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
