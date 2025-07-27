/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image element from a slide
  function getImage(slide) {
    // The image is always the first <img> inside the slide
    const img = slide.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from the slide, skipping the image
  function getTextContent(slide) {
    // We'll collect all elements (not just direct children) except the image wrapper
    // The text content may be nested or sibling; we want all visible text except the main image
    // We'll get direct children that are not the image wrapper, and for the image wrapper (e.g. .image), ignore its content
    const imageWrapper = slide.querySelector('.image');
    const items = [];
    // Collect all direct children of the slide
    slide.childNodes.forEach((node) => {
      if (node === imageWrapper) return;
      // Skip whitespace
      if (node.nodeType === 3 && !node.textContent.trim()) return;
      items.push(node);
    });
    // There could also be content INSIDE the imageWrapper (after the image), check for that
    if (imageWrapper) {
      imageWrapper.childNodes.forEach((node) => {
        // Ignore the actual image element
        if (node.nodeType === 1 && node.tagName.toLowerCase() === 'div' && node.querySelector('img')) return;
        if (node.nodeType === 1 && node.tagName.toLowerCase() === 'img') return;
        if (node.nodeType === 3 && !node.textContent.trim()) return;
        items.push(node);
      });
    }
    if (items.length === 0) return '';
    return items.length === 1 ? items[0] : items;
  }

  // Find the cmp-carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Compose table rows
  const rows = [['Carousel (carousel17)']];
  slides.forEach((slide) => {
    const img = getImage(slide);
    if (!img) return;
    const text = getTextContent(slide);
    rows.push([img, text || '']);
  });

  // Create table and adjust header cell colspan
  const table = WebImporter.DOMUtils.createTable(rows, document);
  const th = table.querySelector('th');
  if (th) th.setAttribute('colspan', '2');

  element.replaceWith(table);
}
