/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Carousel (carousel30)'];

  // Find the carousel content container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  if (!items.length) return;

  // Prepare rows for each slide (image only if no text content)
  const rows = [];
  items.forEach((item) => {
    // Image cell
    let img = item.querySelector('.cmp-image__image');
    if (!img) {
      img = item.querySelector('img');
    }

    // Collect text content (heading, paragraphs, links)
    const textParts = [];
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textParts.push(heading.cloneNode(true));
    item.querySelectorAll('p').forEach(p => textParts.push(p.cloneNode(true)));
    item.querySelectorAll('a').forEach(a => {
      if (!a.closest('p')) textParts.push(a.cloneNode(true));
    });

    if (textParts.length) {
      rows.push([img || '', textParts]);
    } else {
      rows.push([img || '']);
    }
  });

  // Compose the table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
