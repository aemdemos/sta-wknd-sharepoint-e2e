/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;
  // Find the .cmp-contentfragment__elements
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Extract all children for processing
  const children = Array.from(cfElements.children);
  const slides = [];
  let i = 0;
  while (i < children.length) {
    // Look for an H2
    if (children[i].tagName === 'H2') {
      const title = children[i];
      let img = null;
      let desc = null;
      let j = i + 1;
      // Look for image in next siblings (search up to 2 siblings ahead)
      let foundImg = false;
      for (let k = 0; k < 2 && (j + k) < children.length; k++) {
        const maybeImgDiv = children[j + k];
        if (maybeImgDiv && maybeImgDiv.querySelector) {
          const found = maybeImgDiv.querySelector('img');
          if (found) {
            img = found.cloneNode(true);
            foundImg = true;
            j = j + k + 1;
            break;
          }
        }
      }
      // Look for paragraph after image
      if (children[j] && children[j].tagName === 'P') {
        desc = children[j].cloneNode(true);
        j++;
      }
      // Compose text cell
      const textCell = [];
      if (title) {
        const h = document.createElement('h2');
        h.textContent = title.textContent;
        textCell.push(h);
      }
      if (desc) textCell.push(desc);
      if (img) {
        slides.push([img, textCell.length === 1 ? textCell[0] : textCell]);
      }
      i = j;
    } else {
      i++;
    }
  }

  if (slides.length) {
    // Table header
    const headerRow = ['Carousel (carousel32)'];
    // Compose table rows
    const table = [headerRow, ...slides];
    // Create and replace
    const block = WebImporter.DOMUtils.createTable(table, document);
    element.replaceWith(block);
  }
}
