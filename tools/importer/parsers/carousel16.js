/* global WebImporter */
export default function parse(element, { document }) {
  // Block name row
  const headerRow = ['Carousel (carousel16)'];

  // Find the .cmp-contentfragment__elements section within the element
  const cfEl = element.querySelector('.cmp-contentfragment__elements');
  if (!cfEl) return;

  // Prepare rows for table
  const blockRows = [];
  const children = Array.from(cfEl.children);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // Look for each H2 section which will be our slide title
    if (child.tagName === 'H2') {
      // Seek (after the h2) for the next image (nested in .cmp-image)
      let imgDiv = null;
      let j = i + 1;
      while (j < children.length) {
        const maybeDiv = children[j];
        if (maybeDiv.querySelector) {
          imgDiv = maybeDiv.querySelector('.cmp-image');
          if (imgDiv) break;
        }
        j++;
      }
      // Seek after the image for the description paragraph (may be separated by divs)
      let descP = null;
      let k = j + 1;
      while (k < children.length) {
        const maybeP = children[k];
        if (maybeP.tagName === 'P') {
          descP = maybeP;
          break;
        }
        k++;
      }
      // Build text content cell: heading (as h2), then paragraph
      const textCell = [];
      // Use the existing <h2> from .cmp-contentfragment__elements (preserves reference)
      textCell.push(child);
      if (descP) textCell.push(descP);
      // Only add slide row if image is present (image is required)
      if (imgDiv) {
        blockRows.push([imgDiv, textCell]);
      }
      // Move i so we don't process same elements again
      i = k;
    }
  }

  // Only build the carousel block if there is at least one slide
  if (blockRows.length > 0) {
    const cells = [headerRow, ...blockRows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
