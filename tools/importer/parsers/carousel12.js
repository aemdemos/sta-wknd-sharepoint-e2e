/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slides
  const slideEls = Array.from(carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item'));

  // Build content rows (slide rows)
  const slideRows = slideEls.map(slide => {
    let imageCell = '';
    let textCell = '';
    const teaser = slide.querySelector('.cmp-teaser');
    if (teaser) {
      const teaserImg = teaser.querySelector('.cmp-teaser__image img');
      if (teaserImg) imageCell = teaserImg;
      const parts = [];
      const teaserTitle = teaser.querySelector('.cmp-teaser__title');
      if (teaserTitle) parts.push(teaserTitle);
      const teaserDesc = teaser.querySelector('.cmp-teaser__description');
      if (teaserDesc) parts.push(teaserDesc);
      const teaserCta = teaser.querySelector('.cmp-teaser__action-link');
      if (teaserCta) parts.push(teaserCta);
      textCell = parts.length ? parts : '';
    }
    return [imageCell, textCell];
  });

  // Construct cells array: first row has ONE cell (header), each slide row has two cells
  const cells = [['Carousel (carousel12)'], ...slideRows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
