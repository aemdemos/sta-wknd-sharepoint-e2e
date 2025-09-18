/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all carousel items from the cmp-carousel__content
  function getCarouselItems(carouselRoot) {
    const content = carouselRoot.querySelector('.cmp-carousel__content');
    if (!content) return [];
    return Array.from(content.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper to extract the image element from a carousel item
  function getImageFromItem(item) {
    // The image is inside .image > .cmp-image > img
    const img = item.querySelector('.cmp-image__image');
    if (img) {
      return img;
    }
    return null;
  }

  // Helper to extract text content from a carousel item
  function getTextFromItem(item) {
    // Find all elements after the image container
    const imageDiv = item.querySelector('.image');
    if (imageDiv) {
      let sibling = imageDiv.nextElementSibling;
      const fragments = [];
      while (sibling) {
        fragments.push(sibling.cloneNode(true));
        sibling = sibling.nextElementSibling;
      }
      if (fragments.length > 0) {
        // Wrap in a div if multiple elements
        const wrapper = document.createElement('div');
        fragments.forEach(f => wrapper.appendChild(f));
        return wrapper;
      }
    }
    return '';
  }

  // Find the actual carousel root inside the wrapper
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Table header
  const headerRow = ['Carousel (carousel9)'];
  const rows = [headerRow];

  // Get all carousel items
  const items = getCarouselItems(carousel);
  items.forEach((item) => {
    const img = getImageFromItem(item);
    const text = getTextFromItem(item);
    // Always create two columns for each slide row (second cell empty if no text)
    if (img) {
      rows.push([img.cloneNode(true), (text && (typeof text !== 'string' ? text.textContent.trim() !== '' : text.trim() !== '')) ? text : '']);
    }
  });

  // Ensure every row after the header has exactly two columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1) {
      rows[i].push('');
    }
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
