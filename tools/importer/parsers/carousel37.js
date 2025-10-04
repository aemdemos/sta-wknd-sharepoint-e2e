/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all slide items from carousel
  function getSlides(el) {
    const content = el.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  }

  // Helper to extract image from slide
  function getImage(slide) {
    const img = slide.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from slide
  function getTextContent(slide) {
    const textParts = [];
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textParts.push(heading.cloneNode(true));
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => textParts.push(p.cloneNode(true)));
    const link = slide.querySelector('a');
    if (link) textParts.push(link.cloneNode(true));
    if (textParts.length === 0) return '';
    if (textParts.length === 1) return textParts[0];
    const div = document.createElement('div');
    textParts.forEach(part => div.appendChild(part));
    return div;
  }

  const headerRow = ['Carousel (carousel37)'];
  const rows = [headerRow];

  let carousels = [];
  if (element.classList.contains('cmp-carousel')) {
    carousels = [element];
  } else {
    carousels = Array.from(element.querySelectorAll('.cmp-carousel'));
  }

  carousels.forEach(carousel => {
    const slides = getSlides(carousel);
    slides.forEach(slide => {
      const img = getImage(slide);
      const text = getTextContent(slide);
      if (img) {
        rows.push([img, text]); // Always push two columns per row
      }
    });
  });

  // Ensure every row after the header has exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
