/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-carousel element
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel && element.classList.contains('cmp-carousel')) carousel = element;
  if (!carousel) return;

  // Find slides
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;
  const slides = Array.from(slidesContainer.children).filter(c => c.classList.contains('cmp-carousel__item'));

  // To ensure correct table structure: header row with one column, data rows with two columns
  // We'll use an actual DOM table for the header, setting colspan=2 for header cell
  // But since we must use WebImporter.DOMUtils.createTable(), we have to use an array
  // where the header row is ['Carousel (carousel8)', ''] and the th gets colspan=2
  // See how createTable fills the table: if header row.length === 2, but second cell is empty, then colspan can be applied

  // Construct the header row (first cell is the block name, second is "")
  const headerRow = ['Carousel (carousel8)', ''];

  // Now build data rows: always two columns as per requirements
  const rows = slides.map((slide) => {
    // IMAGE CELL: find .image > img
    let imageCell = '';
    const img = slide.querySelector('.image img');
    if (img) imageCell = img;

    // TEXT CELL: gather all non-image content
    const textNodes = [];
    Array.from(slide.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('image')) return;
      if (
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
        (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim())
      ) {
        textNodes.push(node);
      }
    });
    let textCell = '';
    if (textNodes.length > 0) {
      // If more than one node, wrap in a div
      if (textNodes.length === 1) {
        textCell = textNodes[0];
      } else {
        const div = document.createElement('div');
        textNodes.forEach(n => div.appendChild(n));
        textCell = div;
      }
    }
    return [imageCell, textCell];
  });

  // Compose the table array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // After table creation, set colspan=2 on the header th if possible
  // (WebImporter.DOMUtils.createTable uses <th> for the first row)
  const ths = table.querySelectorAll('tr:first-child th');
  if (ths.length === 2 && ths[1].textContent.trim() === '') {
    ths[0].setAttribute('colspan', '2');
    ths[1].remove();
  }

  element.replaceWith(table);
}
