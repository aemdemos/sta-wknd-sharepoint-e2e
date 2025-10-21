/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Carousel (carousel17)
  const headerRow = ['Carousel (carousel17)'];

  // Find the carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Get all carousel slides/items
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // Build rows for each slide
  const rows = items.map(item => {
    // Find image element within the slide
    const img = item.querySelector('img');
    if (!img) return null;

    // Check for visible text content (headings, paragraphs, links)
    const hasText = item.querySelector('h1, h2, h3, h4, h5, h6, p, a[href]');
    if (hasText) {
      // Collect all visible text content elements
      const textElements = [];
      const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) textElements.push(heading.cloneNode(true));
      const paragraphs = Array.from(item.querySelectorAll('p'));
      paragraphs.forEach(p => textElements.push(p.cloneNode(true)));
      const links = Array.from(item.querySelectorAll('a[href]'));
      links.forEach(a => textElements.push(a.cloneNode(true)));
      const textCell = document.createElement('div');
      textElements.forEach(el => textCell.appendChild(el));
      return [img, textCell];
    } else {
      // Only image, single column
      return [img];
    }
  }).filter(Boolean);

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
