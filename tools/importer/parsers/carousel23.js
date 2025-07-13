/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all direct carousel items
  const items = Array.from(carousel.querySelectorAll(':scope > .cmp-carousel__content > .cmp-carousel__item'));
  if (!items.length) return;

  // Prepare the table rows
  const rows = [['Carousel (carousel23)']];

  items.forEach(item => {
    // Image extraction (use existing img element)
    const img = item.querySelector('.cmp-teaser__image img') || item.querySelector('img');

    // Prepare slide text content
    const textContent = [];
    // Title (heading)
    const title = item.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description (might be div or p)
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // If consists only of one <p>, reference that <p> for cleaner structure
      if (desc.children.length === 1 && desc.firstElementChild && desc.firstElementChild.tagName.toLowerCase() === 'p') {
        textContent.push(desc.firstElementChild);
      } else {
        textContent.push(desc);
      }
    }
    // CTA button (link)
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) textContent.push(cta);

    // Add the row
    rows.push([
      img || '',
      textContent.length ? textContent : ''
    ]);
  });

  // Create and insert the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
