/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel18) block parsing
  // Table header row
  const headerRow = ['Carousel (carousel18)'];

  // Find carousel items/slides
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;
  // Only direct children with class 'cmp-carousel__item' are slides
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build table rows for each slide
  const rows = slides.map(slide => {
    // Find image in slide
    const img = slide.querySelector('img');
    // Find any text content in the slide (headings, paragraphs, links, etc.)
    let textCell = '';
    // Collect all text nodes that are not inside the image container
    // This makes the parser more flexible for future content
    const textParts = [];
    // Look for headings, paragraphs, and links anywhere in the slide except inside .image
    const imageContainer = slide.querySelector('.image');
    Array.from(slide.children).forEach(child => {
      if (child !== imageContainer) {
        // If heading
        if (/^H[1-6]$/.test(child.tagName)) {
          textParts.push(child.cloneNode(true));
        }
        // If paragraph
        if (child.tagName === 'P') {
          textParts.push(child.cloneNode(true));
        }
        // If link
        if (child.tagName === 'A') {
          textParts.push(child.cloneNode(true));
        }
        // If container, recursively get text content
        if (child.children.length > 0) {
          child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a').forEach(el => {
            textParts.push(el.cloneNode(true));
          });
        }
      }
    });
    // If there is any text content, create a container
    if (textParts.length > 0) {
      const div = document.createElement('div');
      textParts.forEach(part => div.appendChild(part));
      textCell = div;
    }
    // Always output two columns: image, text (even if text is empty)
    return [img, textCell];
  }).filter(row => row[0]); // Only keep rows with an image

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(block);
}
