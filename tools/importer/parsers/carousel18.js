/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Compose table header
  const cells = [['Carousel (carousel18)']];

  // Each slide (cmp-carousel__item) becomes a table row
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  slides.forEach((slide) => {
    // Image: get the first <img> inside .image, or in the slide
    let img = null;
    const imgContainer = slide.querySelector('.image');
    if (imgContainer) {
      img = imgContainer.querySelector('img');
    }
    if (!img) {
      img = slide.querySelector('img');
    }
    // Text: collect all nodes NOT inside .image containers (including headings, paragraphs, links, etc)
    let textNodes = [];
    Array.from(slide.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        textNodes.push(child);
      }
    });
    // If still no text content, search for all descendants not inside .image
    if (textNodes.length === 0) {
      const descendants = slide.querySelectorAll('*');
      descendants.forEach((el) => {
        if (!el.closest('.image') && el.textContent.trim() && el !== img) {
          // Only add top-level unique elements, not inside .image nor already in textNodes
          if (!textNodes.includes(el)) {
            textNodes.push(el);
          }
        }
      });
    }
    // Remove empties, keep only elements with content
    textNodes = textNodes.filter((n) => {
      if (!n) return false;
      if (n.nodeType !== 1) return false;
      if (n.textContent && n.textContent.trim().length > 0) return true;
      if (n.children && n.children.length > 0) return true;
      return false;
    });
    // If still empty, fallback to image alt/title/caption
    if (textNodes.length === 0 && img) {
      let text = img.getAttribute('title') || img.getAttribute('alt') || '';
      if (!text) {
        const meta = slide.querySelector('meta[itemprop="caption"]');
        if (meta && meta.content) text = meta.content;
      }
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        textNodes.push(p);
      }
    }
    // Compose row: image cell, text cell
    cells.push([
      img || '',
      textNodes.length > 0 ? textNodes : ''
    ]);
  });

  // Create and replace with the new table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
