/* global WebImporter */
export default function parse(element, { document }) {
  function getCarouselItems(carouselEl) {
    const content = carouselEl.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));
  }

  function getImageFromItem(item) {
    const imageDiv = item.querySelector('.cmp-image');
    if (!imageDiv) return null;
    const img = imageDiv.querySelector('img');
    return img || null;
  }

  function getTextContentFromItem(item) {
    // Try to extract all text content from the slide
    // Look for headings, paragraphs, links, etc. inside the item
    // Exclude the image itself
    const imageDiv = item.querySelector('.cmp-image');
    let textNodes = [];
    Array.from(item.children).forEach(child => {
      if (child !== imageDiv) {
        // Collect all text content and elements except the image
        textNodes.push(child.cloneNode(true));
      }
    });
    if (textNodes.length === 0) return '';
    // If only text, return as string. If elements, wrap in a div.
    const wrapper = document.createElement('div');
    textNodes.forEach(node => wrapper.appendChild(node));
    return wrapper;
  }

  const carouselEl = element.querySelector('.cmp-carousel');
  if (!carouselEl) return;

  const items = getCarouselItems(carouselEl);

  const headerRow = ['Carousel (carousel18)'];
  const rows = [headerRow];

  items.forEach(item => {
    const img = getImageFromItem(item);
    if (img) {
      const textContent = getTextContentFromItem(item);
      rows.push([img, textContent]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
