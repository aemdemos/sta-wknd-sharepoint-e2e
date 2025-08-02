/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as in the example
  const headerRow = ['Carousel (carousel26)'];

  // Get the teaser block (slide)
  // Generalize for possible multiple slides in the future, but for now process this one
  // The .cmp-teaser__image and .cmp-teaser__content are both direct children of .cmp-teaser
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image element (first cell)
  let imageCell = null;
  const teaserImage = teaser.querySelector('.cmp-teaser__image img');
  if (teaserImage) {
    imageCell = teaserImage;
  }

  // Get the text content (second cell)
  const textContent = [];
  const content = teaser.querySelector('.cmp-teaser__content');
  if (content) {
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) {
      textContent.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent.push(desc);
    }
    // CTA (action link)
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textContent.push(cta);
    }
  }

  // Only add the row if there is at least an image (as per block definition)
  if (!imageCell) return;
  const slideRow = [imageCell, textContent];

  const cells = [headerRow, slideRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
