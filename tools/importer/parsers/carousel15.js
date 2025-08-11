/* global WebImporter */
export default function parse(element, { document }) {
  // Header as per example markdown
  const headerRow = ['Carousel (carousel15)'];

  // Find carousel
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.children).filter(child => child.classList.contains('cmp-carousel__item'));

  const rows = slides.map(slide => {
    // Image cell: always reference the <img> inside the slide
    const img = slide.querySelector('img');
    const imageCell = img || '';

    // Text cell: collect all content not in image containers
    // We want ANY meaningful content (including text nodes, headings, paragraphs, links, etc.)
    const textElements = [];
    Array.from(slide.childNodes).forEach(node => {
      // Skip image containers
      if (node.nodeType === 1) {
        const cls = node.classList;
        if (cls && (cls.contains('image') || cls.contains('cmp-image'))) return;
        // If this is an element and not image container, include it
        textElements.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Text node: wrap in <p> to preserve content
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textElements.push(p);
      }
    });
    // Also, check recursively for any headings, paragraphs, or links inside other containers except images
    Array.from(slide.children).forEach(child => {
      const cls = child.classList;
      if (cls && (cls.contains('image') || cls.contains('cmp-image'))) return;
      // Query for meaningful descendants
      child.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,ul,ol,li').forEach(el => {
        if (!textElements.includes(el)) textElements.push(el);
      });
    });
    const textCell = textElements.length > 0 ? textElements : '';
    return [imageCell, textCell];
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
