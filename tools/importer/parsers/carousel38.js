/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should always match the component name and be column count 1
  const headerRow = ['Carousel (carousel38)'];
  const cells = [headerRow];

  // Find the carousel root block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all individual slide items (each becomes a row)
  const slides = carousel.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // IMAGE CELL: find first image descendant
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // TEXT CELL: Gather all text content that is not part of the image
    // 1. Find all direct children of the slide that are not the image container
    // 2. If the image container has siblings after the image, also include those
    let textParts = [];
    // 1. Get all direct children of the slide
    const children = Array.from(slide.children);
    // Find the image container (has <img>)
    let imgContainerIdx = children.findIndex((c) => c.querySelector && c.querySelector('img'));
    // Collect all children except the image container
    children.forEach((child, idx) => {
      if (idx !== imgContainerIdx) {
        if (child.textContent.trim()) {
          textParts.push(child);
        }
      }
    });
    // 2. If the image container has more elements after the <img>
    if (imgContainerIdx !== -1) {
      const imgContainer = children[imgContainerIdx];
      let foundImg = false;
      Array.from(imgContainer.childNodes).forEach((n) => {
        // Find everything *after* the image in the same container
        if (n.nodeType === 1 && n.tagName === 'IMG') {
          foundImg = true;
          return;
        }
        if (foundImg) {
          if ((n.nodeType === 1 && n.textContent.trim()) || (n.nodeType === 3 && n.textContent.trim())) {
            textParts.push(n);
          }
        }
      });
    }
    // Also check for text nodes that are direct children of slide (sometimes happens)
    Array.from(slide.childNodes).forEach(n => {
      if (n.nodeType === 3 && n.textContent.trim()) {
        textParts.push(document.createTextNode(n.textContent));
      }
    });

    // If no text at all, text cell is ''
    let textCell = '';
    if (textParts.length === 1) textCell = textParts[0];
    else if (textParts.length > 1) textCell = textParts;
    // If image missing, leave blank per guidelines

    // Add the row: [image, text]
    cells.push([imageCell, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan on header if there are 2 columns
  const th = table.querySelector('tr:first-child th');
  if (th && table.rows[1] && table.rows[1].cells.length > 1) {
    th.colSpan = table.rows[1].cells.length;
  }
  // Replace the original element
  element.replaceWith(table);
}
