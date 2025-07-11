/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header exactly as in the example
  const cells = [['Carousel (carousel27)']];

  // Each slide is a row: find the content (image, text, link)
  // For this input there is only one slide, but code is robust for variations
  const teasers = element.querySelectorAll('.cmp-teaser');
  teasers.forEach((teaser) => {
    // 1st column: image
    let imageCell = '';
    const imageDiv = teaser.querySelector('.cmp-teaser__image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) imageCell = img;
    }

    // 2nd column: text (title, description, CTA)
    const contentDiv = teaser.querySelector('.cmp-teaser__content');
    const textCell = [];
    if (contentDiv) {
      // Title
      const title = contentDiv.querySelector('.cmp-teaser__title');
      if (title) textCell.push(title);
      // Description
      const desc = contentDiv.querySelector('.cmp-teaser__description');
      if (desc) textCell.push(desc);
      // CTA
      const cta = contentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) textCell.push(cta);
    }
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
