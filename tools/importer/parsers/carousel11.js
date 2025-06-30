/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first image (img) in a given ancestor
  function findImage(el) {
    if (!el) return null;
    const img = el.querySelector('img');
    return img || null;
  }

  // Prepare the table header exactly as in the instructions
  const headerRow = ['Carousel (carousel11)'];
  const rows = [headerRow];

  // 1. Find the carousel container with slides
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;
  // 2. Find all direct .cmp-carousel__item children (slides)
  const slideEls = Array.from(carouselContent.querySelectorAll(':scope > .cmp-carousel__item'));

  slideEls.forEach((slide) => {
    // Find teaser inside slide
    const teaser = slide.querySelector('.cmp-teaser');
    if (!teaser) return;

    // IMAGE -- required, always in .cmp-teaser__image
    const teaserImage = teaser.querySelector('.cmp-teaser__image');
    let img = findImage(teaserImage);
    // if no image, fallback to empty string
    const imageCell = img ? img : '';

    // TEXT CONTENT (title, description, CTA)
    const textCell = [];
    // Title
    const title = teaser.querySelector('.cmp-teaser__title');
    if (title) textCell.push(title);
    // Description
    const desc = teaser.querySelector('.cmp-teaser__description');
    if (desc) textCell.push(desc);
    // CTA(s)
    const actionLinks = Array.from(teaser.querySelectorAll('.cmp-teaser__action-link'));
    if (actionLinks.length) textCell.push(actionLinks.length === 1 ? actionLinks[0] : actionLinks);

    // If no text, keep cell blank
    rows.push([
      imageCell,
      textCell.length === 1 ? textCell[0] : (textCell.length ? textCell : '')
    ]);
  });
  
  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
