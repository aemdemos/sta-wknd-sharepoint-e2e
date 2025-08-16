/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Carousel (carousel15)'];

  // Find carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const slidesContainer = carousel.querySelector('.cmp-carousel__content');
  if (!slidesContainer) return;

  // Get all slides
  const slideElems = Array.from(slidesContainer.children).filter(el => el.classList.contains('cmp-carousel__item'));

  const rows = slideElems.map(slide => {
    // Get the image from each slide
    const img = slide.querySelector('img');
    // Collect all possible text content in the slide except for the .image container
    let textContent = [];
    const imageContainer = slide.querySelector('.image');

    // Go through all children and descendants except the image container
    Array.from(slide.childNodes).forEach(child => {
      // Ignore image container
      if (child === imageContainer) return;
      if (child.nodeType === 1) {
        // For elements, recursively collect headings, paragraphs, lists, and links
        const tags = ['H1','H2','H3','H4','H5','H6','P','A','UL','OL'];
        if (tags.includes(child.tagName)) {
          textContent.push(child);
        } else {
          // Search descendants
          tags.forEach(tag => {
            child.querySelectorAll && child.querySelectorAll(tag).forEach(el => textContent.push(el));
          });
        }
      }
    });

    // Remove duplicates (in case of overlap)
    textContent = [...new Set(textContent)];

    // If no text content found, set to empty string to ensure cell structure
    const textCell = textContent.length ? textContent : '';
    return [img, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
