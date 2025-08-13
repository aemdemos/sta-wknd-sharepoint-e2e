/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row must match example exactly
  const headerRow = ['Carousel (carousel22)'];

  // 2. Helper to extract a slide as a table row: [image, content[]]
  function extractSlide(slideEl) {
    // IMAGE: first cell
    let img = null;
    const teaserImgDiv = slideEl.querySelector('.cmp-teaser__image');
    if (teaserImgDiv) {
      img = teaserImgDiv.querySelector('img');
    }

    // CONTENT: second cell (title, description, CTA, in order)
    const content = [];
    const teaserContentDiv = slideEl.querySelector('.cmp-teaser__content');
    if (teaserContentDiv) {
      // Title (as heading)
      const title = teaserContentDiv.querySelector('.cmp-teaser__title');
      if (title) content.push(title);
      // Description (may be plain text or HTML)
      const desc = teaserContentDiv.querySelector('.cmp-teaser__description');
      if (desc) content.push(desc);
      // CTA (button or link)
      const cta = teaserContentDiv.querySelector('.cmp-teaser__action-link');
      if (cta) content.push(cta);
    }
    return [img, content];
  }

  // 3. Find the carousel slides (all .cmp-carousel__item, within .cmp-carousel__content)
  let carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) carouselContent = element; // fallback
  const slideDivs = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  // 4. Build the cells array: first row is header; others are slides
  const cells = [headerRow];

  slideDivs.forEach(slide => {
    // Each slide always has one .teaser child (may be wrapped)
    const teaser = slide.querySelector('.teaser') || slide;
    cells.push(extractSlide(teaser));
  });

  // 5. Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
