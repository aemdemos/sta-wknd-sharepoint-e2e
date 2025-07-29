/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Build the block header row exactly as in example
  const headerRow = ['Carousel (carousel22)'];
  const rows = [headerRow];

  // 2. Locate the carousel and its slides
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  items.forEach((item) => {
    // Image cell: image is mandatory, so find .cmp-teaser__image img
    let imageCell = '';
    const teaserImage = item.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const img = teaserImage.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Text cell may include heading, description, and CTA
    let textCellContent = [];
    const teaserContent = item.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title (keep heading element as is)
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        textCellContent.push(title);
      }
      // Description or Additional Content
      const description = teaserContent.querySelector('.cmp-teaser__description');
      if (description) {
        textCellContent.push(description);
      }
      // CTA(s)
      const actionContainer = teaserContent.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const ctas = Array.from(actionContainer.querySelectorAll('a'));
        ctas.forEach((cta) => {
          textCellContent.push(cta);
        });
      }
    }
    // If there's nothing in textCellContent, set as empty string
    const textCell = textCellContent.length > 0 ? textCellContent : '';
    rows.push([imageCell, textCell]);
  });

  // 3. Create and replace with the table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
