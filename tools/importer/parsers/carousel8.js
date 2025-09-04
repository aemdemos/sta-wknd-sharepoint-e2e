/* global WebImporter */
export default function parse(element, { document }) {
  if (!element) return;

  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    let imageCell = null;
    let textCell = '';
    const imageWrapper = item.querySelector('.image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      } else {
        imageCell = imageWrapper;
      }
    }
    // Extract text content for the text cell
    const textFragments = [];
    item.querySelectorAll(':scope > :not(.image)').forEach((el) => {
      if (/^H[1-6]$/i.test(el.tagName) || el.tagName === 'P' || el.tagName === 'A') {
        textFragments.push(el.cloneNode(true));
      } else if (el.textContent && el.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = el.textContent.trim();
        textFragments.push(p);
      }
    });
    if (textFragments.length > 0) {
      textCell = textFragments;
    }
    // Always push two columns: image and text (empty string if no text)
    rows.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
