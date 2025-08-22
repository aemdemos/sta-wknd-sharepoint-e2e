/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Carousel (carousel15)'];

  // Find the carousel block
  const carouselRoot = element.querySelector('[class*="cmp-carousel"]');
  if (!carouselRoot) return;

  // Find the content container
  const content = carouselRoot.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all slide items
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  const rows = slides.map((slide) => {
    // Find first <img> inside slide
    const image = slide.querySelector('img');

    // Try to get all text content that's not inside the image container
    // Get all elements that are not the image wrapper
    let textContentElements = [];

    // If there is a .image container, skip it
    Array.from(slide.children).forEach(child => {
      if (!child.classList.contains('image')) {
        // If the element has text content (even if it's whitespace), add it
        if (child.textContent && child.textContent.trim() !== '') {
          textContentElements.push(child);
        }
        // If it has important children (like headings, links, etc), add them too
        Array.from(child.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a')).forEach(e => {
          if (!textContentElements.includes(e) && e.textContent.trim() !== '') {
            textContentElements.push(e);
          }
        });
      }
    });
    // Also, if meta[itemprop=caption] is present in image container, add as text
    const metaCaption = slide.querySelector('.image meta[itemprop="caption"]');
    if (metaCaption && metaCaption.content && metaCaption.content.trim() !== '') {
      const p = document.createElement('p');
      p.textContent = metaCaption.content;
      textContentElements.push(p);
    }
    // If no text content found, use empty string
    const rightCell = textContentElements.length ? textContentElements : '';
    // Always output two columns
    return [image || '', rightCell];
  });
  const cells = [headerRow, ...rows];
  // Build the table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
