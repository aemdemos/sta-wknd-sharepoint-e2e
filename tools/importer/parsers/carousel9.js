/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find the slides container
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all slides
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // Prepare header row with exact name
  const rows = [['Carousel (carousel9)']];

  slides.forEach((slide) => {
    // Find the image element (img inside .cmp-image inside .image)
    let imageEl = null;
    const imgWrap = slide.querySelector('.image .cmp-image');
    if (imgWrap) {
      imageEl = imgWrap.querySelector('img');
    }

    // Prepare text content cell (can include heading, paragraph, link, etc.)
    const textCell = [];
    // Look for heading (h1-h6)
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textCell.push(heading);
    // Look for all paragraphs
    slide.querySelectorAll('p').forEach(p => textCell.push(p));
    // Look for links not inside image
    slide.querySelectorAll('a').forEach(a => textCell.push(a));
    
    // If there is no text content, pass empty string
    rows.push([
      imageEl || '',
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
