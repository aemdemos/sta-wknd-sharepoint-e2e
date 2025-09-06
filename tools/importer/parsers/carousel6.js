/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  if (!items.length) return;

  // Table header row as required
  const headerRow = ['Carousel (carousel6)'];
  const rows = [headerRow];

  items.forEach((item) => {
    // Each item contains a teaser block
    const teaser = item.querySelector('.cmp-teaser');
    if (!teaser) return;

    // Image cell: find the img inside .cmp-teaser__image
    let imgCell = null;
    const teaserImage = teaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imgCell = teaserImage;
    }

    // Text cell: build with title, description, CTA
    const textContent = [];
    // Title (h2)
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) {
      textContent.push(title);
    }
    // Description (div or p)
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent.push(desc);
    }
    // CTA (link)
    const cta = teaser.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textContent.push(cta);
    }

    rows.push([imgCell, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
