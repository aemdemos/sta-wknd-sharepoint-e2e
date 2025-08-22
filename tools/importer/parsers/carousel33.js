/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function childrenArray(parent, selector) {
    return Array.from(parent.querySelectorAll(':scope > ' + selector));
  }

  // Find the contentfragment article with slides
  const cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return;
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  // We'll look for an alternating sequence of H2 (title), image (in .cmp-image), and P (description).
  const nodes = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1); // element nodes only

  // Scan for slides
  const slides = [];
  let i = 0;
  while (i < nodes.length) {
    // Look for an H2 - marks the start of a slide
    if (nodes[i].tagName === 'H2') {
      const titleEl = nodes[i];
      i++;
      // Scan for image (usually in a .cmp-image inside .aem-Grid, sometimes wrapped in extra <div>)
      let imageEl = null;
      let imgIdx = i;
      // Look ahead up to 2 nodes to find .cmp-image
      for (let j = 0; j < 2 && (imgIdx + j) < nodes.length; j++) {
        const n = nodes[imgIdx + j];
        if (n && n.querySelector) {
          const img = n.querySelector('.cmp-image');
          if (img) {
            imageEl = img;
            i = imgIdx + j + 1;
            break;
          }
        }
      }
      if (!imageEl) {
        // Defensive: if no image, scan next few nodes for image
        for (; i < nodes.length; i++) {
          if (nodes[i].querySelector) {
            const img = nodes[i].querySelector('.cmp-image');
            if (img) {
              imageEl = img;
              i++;
              break;
            }
          }
        }
      }
      // Next, look for a <p> (description)
      let descEl = null;
      if (i < nodes.length && nodes[i].tagName === 'P') {
        descEl = nodes[i];
        i++;
      }
      if (imageEl) {
        // Compose the text cell as [title, desc] (if present)
        const textCell = [];
        if (titleEl) textCell.push(titleEl);
        if (descEl) textCell.push(descEl);
        slides.push([imageEl, textCell]);
      }
    } else {
      i++;
    }
  }

  // Defensive: if no slides found, do nothing
  if (!slides.length) return;

  // Header row exactly matches example
  const headerRow = ["Carousel (carousel33)"];
  const cells = [headerRow].concat(slides);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
