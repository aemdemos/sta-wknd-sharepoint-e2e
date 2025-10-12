/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel33) block: header row
  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  // Get carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    element.remove();
    return;
  }

  // Each slide is a .cmp-carousel__item
  const items = carouselContent.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Find image inside the item
    const img = item.querySelector('img');
    // Try to extract text content from the item
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    const paragraphs = item.querySelectorAll('p');
    const links = item.querySelectorAll('a');
    const fragments = [];
    if (heading) fragments.push(heading.cloneNode(true));
    paragraphs.forEach(p => fragments.push(p.cloneNode(true)));
    links.forEach(a => fragments.push(a.cloneNode(true)));
    if (img) {
      if (fragments.length) {
        rows.push([img, fragments]);
      } else {
        // Only one cell (image) per row if no text content
        rows.push([img]);
      }
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
