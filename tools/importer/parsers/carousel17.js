/* global WebImporter */
export default function parse(element, { document }) {
  function getSlides(carouselContent) {
    return Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  function getImage(slide) {
    const img = slide.querySelector('img');
    return img || null;
  }

  function getTextContent(slide) {
    // Try to find a heading (h1-h6)
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    // Try to find a paragraph
    const paragraph = slide.querySelector('p');
    // Try to find a link
    const link = slide.querySelector('a');

    const content = [];
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent;
      content.push(h);
    }
    if (paragraph) {
      const p = document.createElement('p');
      p.textContent = paragraph.textContent;
      content.push(p);
    }
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      content.push(a);
    }
    // If no structured elements, try to get all text
    if (content.length === 0) {
      const text = slide.textContent.trim();
      if (text) content.push(text);
    }
    return content.length > 0 ? content : '';
  }

  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  const slides = getSlides(carouselContent);

  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    const img = getImage(slide);
    const textContent = getTextContent(slide);
    if (img) {
      rows.push([img, textContent]); // Always 2 columns: image, text (may be empty)
    }
  });

  // Ensure every row after header has exactly 2 columns (image, text)
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) {
      rows[i].push('');
    }
  }

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
