/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel8) block
  const headerRow = ['Carousel (carousel8)'];
  const rows = [headerRow];

  // Find carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items/slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = content.querySelectorAll('.cmp-carousel__item');

  items.forEach((item) => {
    // Get image
    const img = item.querySelector('img');
    if (!img) return;
    // Get text content from slide (title, description, CTA)
    // Try to find heading, paragraph, and link inside the item
    let textCell = document.createElement('div');
    // Heading
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) textCell.appendChild(heading.cloneNode(true));
    // Paragraphs
    item.querySelectorAll('p').forEach(p => {
      textCell.appendChild(p.cloneNode(true));
    });
    // CTA link (if present)
    const cta = item.querySelector('a');
    if (cta) textCell.appendChild(cta.cloneNode(true));
    // If no text, omit the second cell
    if (!textCell.hasChildNodes()) {
      rows.push([img]);
    } else {
      rows.push([img, textCell]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
