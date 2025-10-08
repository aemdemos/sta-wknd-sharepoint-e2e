/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required block name as the header
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find the carousel content wrapper
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Each slide is a .cmp-carousel__item
  const slides = carouselContent.querySelectorAll('.cmp-carousel__item');
  slides.forEach((slide) => {
    // Find the image inside the slide
    let img = slide.querySelector('.image [data-cmp-is="image"] img');
    if (!img) {
      img = slide.querySelector('img');
    }
    // Gather text content for the second column (if any)
    let textContent = '';
    // Try to find a heading inside the slide
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textContent += heading.outerHTML;
    }
    // Try to find description paragraphs
    const paragraphs = slide.querySelectorAll('p');
    paragraphs.forEach((p) => {
      textContent += p.outerHTML;
    });
    // Try to find CTA links
    const cta = slide.querySelector('a');
    if (cta) {
      textContent += cta.outerHTML;
    }
    // If there's any text content, create a cell element and push two columns
    if (textContent.trim()) {
      const textCell = document.createElement('div');
      textCell.innerHTML = textContent;
      rows.push([img, textCell]);
    } else {
      // Only image column if no text content
      rows.push([img]);
    }
  });

  // Replace the original element with the new table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
