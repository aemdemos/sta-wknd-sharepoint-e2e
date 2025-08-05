/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' image list block
  const imageList = element.querySelector('.image-list.list > ul.cmp-image-list');
  if (!imageList) return;

  // Prepare the header row (exact, from the example)
  const headerRow = ['Cards (cards4)'];

  // For each card (li), extract image and text content
  const rows = Array.from(imageList.querySelectorAll(':scope > li.cmp-image-list__item')).map(li => {
    // Image (mandatory, first cell)
    let imageEl = null;
    const img = li.querySelector('img');
    if (img) imageEl = img;
    // Title (should be strong)
    let titleEl = null;
    const titleSpan = li.querySelector('.cmp-image-list__item-title');
    if (titleSpan) {
      // Use strong to match example bold
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      titleEl = strong;
    }
    // Description (if exists)
    let descEl = null;
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan) {
      descEl = descSpan;
    }
    // Build content cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      // Add line break if both title and description exist
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    // Always two cells per card row
    return [imageEl, textCell];
  }).filter(row => row && (row[0] || row[1]));

  // Compose table array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the image list's parent (the div) with the block table
  const imageListParentDiv = imageList.closest('.image-list.list');
  if (imageListParentDiv) {
    imageListParentDiv.replaceWith(table);
  }
}
