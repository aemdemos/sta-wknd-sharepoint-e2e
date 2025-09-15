/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const carouselContent = carousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all slides
  const slides = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  // Build the table rows
  const headerRow = ['Carousel (carousel31)'];
  const rows = [headerRow];

  slides.forEach((slide) => {
    // Get image
    const img = slide.querySelector('img');
    // Get all possible text content from the slide (not just indicator)
    let textCell = undefined;
    // Find any text content inside the slide except for the image
    // We'll look for headings, paragraphs, links, etc.
    const textFragments = [];
    // Find heading
    const heading = slide.querySelector('h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent;
      textFragments.push(h);
    }
    // Find paragraphs
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => {
      const para = document.createElement('p');
      para.textContent = p.textContent;
      textFragments.push(para);
    });
    // Find links
    const links = slide.querySelectorAll('a');
    links.forEach(a => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent;
      textFragments.push(link);
    });
    // If no heading/paragraph/link, try to get any text nodes (fallback)
    if (textFragments.length === 0) {
      // Get all text nodes except inside the image
      slide.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textFragments.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
    // Only push two columns if there is text content, otherwise only image (no empty column)
    if (textFragments.length > 0) {
      rows.push([img, textFragments]);
    } else {
      rows.push([img]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new table
  element.replaceWith(table);
}
