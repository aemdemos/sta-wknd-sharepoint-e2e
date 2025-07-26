/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-carousel inside the container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  // Find all slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.children).filter(child => child.classList && child.classList.contains('cmp-carousel__item'));
  // Table: header in first row, then image+text rows
  const rows = [['Carousel (carousel16)']];
  slides.forEach(slide => {
    // Get the image (reference the existing img element)
    const img = slide.querySelector('img.cmp-image__image');
    if (!img) return;
    // Prepare the text cell: if there's text in the slide (non-image), grab it; else use title/alt
    let textCell = '';
    // To collect *all* non-image, non-whitespace content inside the slide, regardless of depth
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_ELEMENT, null);
    let foundText = false;
    let contentFragments = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      // skip image containers
      if (node.classList && node.classList.contains('cmp-image')) continue;
      // skip image wrappers
      if (node.tagName === 'IMG') continue;
      // If the node contains visible text and is not just a container for image
      if (
        (node.tagName.match(/^H[1-6]$|^P$|^A$|^UL$|^OL$|^LI$/i)) &&
        node.textContent.trim().length > 0
      ) {
        contentFragments.push(node);
        foundText = true;
      }
    }
    if (foundText) {
      textCell = contentFragments;
    } else {
      // fallback: use title or alt as heading
      let altOrTitle = img.title || img.alt;
      if (altOrTitle) {
        const h2 = document.createElement('h2');
        h2.textContent = altOrTitle;
        textCell = h2;
      } else {
        textCell = '';
      }
    }
    rows.push([img, textCell]);
  });
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
