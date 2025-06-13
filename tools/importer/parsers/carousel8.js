/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row exactly as in the example
  const headerRow = ['Carousel (carousel8)'];

  // Get the carousel inner content
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  const carouselContent = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  // Find all carousel items/slides
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));
  const rows = [];

  items.forEach((item) => {
    // First column: the image (the <img> element inside the slide)
    const img = item.querySelector('img');
    // If there is no image, skip this slide (image is mandatory)
    if (!img) return;
    // Second column: text (heading/description/CTA), if present, else empty string
    let textContent = [];
    const imageWrapper = item.querySelector('.image');
    const possibles = Array.from(item.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a'))
      .filter(el => !(imageWrapper && imageWrapper.contains(el)));
    if (possibles.length > 0) {
      textContent = possibles;
    }
    // Structure: only include the second cell if there is any text content
    if (textContent.length > 0) {
      rows.push([img, textContent]);
    } else {
      rows.push([img]);
    }
  });

  // Compose table data and create table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
