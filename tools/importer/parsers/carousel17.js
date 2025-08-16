/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  const cmpContent = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!cmpContent) return;

  // Create the header row exactly as in the example
  const cells = [['Carousel (carousel17)']];

  // Find all slides ('.cmp-carousel__item')
  const slides = Array.from(cmpContent.querySelectorAll('.cmp-carousel__item'));
  slides.forEach((slide) => {
    // First column: the image element (mandatory)
    let imageCell = '';
    const img = slide.querySelector('img');
    if (img) imageCell = img;

    // Second column: text content (if any)
    // Look for all direct children that are not the image container
    let textCell = '';
    // Collect all non-image children content
    const nonImage = Array.from(slide.children).filter(child => !child.classList.contains('image'));
    // If there is any non-image content, include all its content as is
    if (nonImage.length > 0) {
      // Gather all childNodes (not just elements) to include possible text nodes
      let contentList = [];
      nonImage.forEach((child) => {
        // If the child has children, grab all children
        if (child.children && child.children.length > 0) {
          contentList.push(...Array.from(child.children));
        } else if (child.textContent && child.textContent.trim()) {
          // If only text content, keep it as a paragraph (for semantic meaning)
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          contentList.push(p);
        }
      });
      // Use original element(s) if nothing was added above
      if (contentList.length === 0) {
        contentList = nonImage;
      }
      // If just one element, use it directly
      textCell = contentList.length === 1 ? contentList[0] : contentList;
    } else if (img && img.alt && img.alt.trim()) {
      // If no text content but the image has an alt text, use it as a fallback
      const p = document.createElement('p');
      p.textContent = img.alt.trim();
      textCell = p;
    }
    // Add row: always two columns (image, text)
    cells.push([imageCell, textCell]);
  });
  // Replace original element with the new block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
