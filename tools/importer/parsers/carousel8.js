/* global WebImporter */
export default function parse(element, { document }) {
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  }

  function getImageElement(carouselItem) {
    const img = carouselItem.querySelector('img');
    return img || null;
  }

  function getTextElement(carouselItem, doc) {
    // Try to extract any text content associated with the slide
    // Look for headings, paragraphs, or any visible text
    // Since source HTML may not have explicit text, try to get alt/title/caption
    const img = carouselItem.querySelector('img');
    let textParts = [];
    let title = '';
    let desc = '';
    if (img) {
      // Prefer caption meta, then title, then alt
      const metaCaption = carouselItem.querySelector('meta[itemprop="caption"]');
      if (metaCaption && metaCaption.content) {
        title = metaCaption.content;
      } else if (img.title) {
        title = img.title;
      } else if (img.alt) {
        title = img.alt;
      }
    }
    if (title) {
      const h = doc.createElement('h2');
      h.textContent = title;
      textParts.push(h);
    }
    // Also check for any additional text nodes inside the slide
    // (unlikely in this source, but future-proof)
    Array.from(carouselItem.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (/^h[1-6]$/.test(node.tagName) || node.tagName === 'P') {
          textParts.push(node.cloneNode(true));
        }
      }
    });
    // If there is no extra element, but we have a title, that's enough
    if (textParts.length === 0 && title) {
      return title;
    }
    if (textParts.length === 1) {
      return textParts[0];
    }
    if (textParts.length > 1) {
      const wrapper = doc.createElement('div');
      textParts.forEach(el => wrapper.appendChild(el));
      return wrapper;
    }
    return '';
  }

  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const slides = getCarouselItems(carousel);
  if (!slides.length) return;

  const rows = [];
  const headerRow = ['Carousel (carousel8)'];
  rows.push(headerRow);

  slides.forEach((slide) => {
    const img = getImageElement(slide);
    const textContent = getTextElement(slide, document);
    if (img) {
      rows.push([img, textContent]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
