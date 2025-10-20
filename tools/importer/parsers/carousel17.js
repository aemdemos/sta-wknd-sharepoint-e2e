/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as the header row
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // Find the main carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Each slide is a direct child with class 'cmp-carousel__item'
  const slides = carouselContent.querySelectorAll(':scope > .cmp-carousel__item');

  slides.forEach((slide) => {
    // Find the image inside the slide
    const img = slide.querySelector('img');
    // Gather text content from the slide (title, description, link, etc.)
    let textContent = '';
    // Collect heading (if any)
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textContent += heading.outerHTML;
    }
    // Collect paragraphs
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach(p => {
      textContent += p.outerHTML;
    });
    // Collect links (if any)
    const links = slide.querySelectorAll('a');
    links.forEach(a => {
      textContent += a.outerHTML;
    });
    // Always create two columns per row, second column empty if no text
    rows.push([img, textContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
