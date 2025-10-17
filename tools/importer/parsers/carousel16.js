/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const headerRow = ['Carousel (carousel16)'];

  // Find the main contentfragment block
  const cf = element.querySelector('.cmp-contentfragment__elements');
  if (!cf) return;

  // We'll build slides by scanning children in order
  const slides = [];
  const children = Array.from(cf.children);

  // Find all image blocks and for each, collect heading and description
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Find image
    let image = null;
    if (node.querySelector && node.querySelector('.cmp-image__image')) {
      image = node.querySelector('.cmp-image__image');
    }
    if (!image) continue;

    // Find heading (h2) and all description (p) for this image
    // Scan backwards for heading (h2)
    let heading = null;
    for (let j = i - 1; j >= 0; j--) {
      if (children[j].tagName === 'H2') {
        heading = children[j];
        break;
      }
    }
    // Scan backwards for all description (p) until previous image or h2
    const descriptions = [];
    for (let k = i - 1; k >= 0; k--) {
      if (children[k].querySelector && children[k].querySelector('.cmp-image__image')) {
        break;
      }
      if (children[k].tagName === 'H2') {
        break;
      }
      if (children[k].tagName === 'P') {
        descriptions.unshift(children[k]); // preserve order
      }
    }
    // Compose text cell: heading + all descriptions
    const textCell = [];
    if (heading) textCell.push(heading.cloneNode(true));
    descriptions.forEach(p => textCell.push(p.cloneNode(true)));
    slides.push([image.cloneNode(true), textCell]);
  }

  // Defensive: If no slides found, don't replace
  if (!slides.length) return;

  // Build table rows
  const rows = [headerRow, ...slides];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
