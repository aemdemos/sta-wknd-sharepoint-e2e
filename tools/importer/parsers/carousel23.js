/* global WebImporter */
export default function parse(element, { document }) {
  // Gather slide rows
  const slideRows = [];
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));
  slides.forEach((slide) => {
    // Image (first cell)
    let imageCell = '';
    const teaserImage = slide.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      const cmpImage = teaserImage.querySelector('[data-cmp-is="image"]');
      if (cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) imageCell = img;
      }
    }
    if (!imageCell) imageCell = document.createTextNode('');
    // Text Content (second cell)
    let textCellContent = [];
    const teaserContent = slide.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Title
      const title = teaserContent.querySelector('.cmp-teaser__title');
      if (title) {
        let headingTag = title.tagName || 'H2';
        const heading = document.createElement(headingTag.toLowerCase());
        heading.innerHTML = title.innerHTML;
        textCellContent.push(heading);
      }
      // Description
      const desc = teaserContent.querySelector('.cmp-teaser__description');
      if (desc) {
        let addedDesc = false;
        Array.from(desc.childNodes).forEach((child) => {
          if (child.nodeType === 1 && child.tagName === 'P') {
            textCellContent.push(child); // reference existing
            addedDesc = true;
          }
        });
        if (!addedDesc && desc.textContent.trim()) {
          const p = document.createElement('p');
          p.innerHTML = desc.innerHTML.trim();
          textCellContent.push(p);
        }
      }
      // CTA
      const cta = teaserContent.querySelector('.cmp-teaser__action-container a');
      if (cta) textCellContent.push(cta);
    }
    if (textCellContent.length === 0) textCellContent = [''];
    slideRows.push([imageCell, textCellContent]);
  });
  // Header row: single cell
  const rows = [['Carousel (carousel23)'], ...slideRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header row: span both columns if table is >1 column
  const th = table.querySelector('th');
  if (slideRows.length && slideRows[0].length === 2 && th) {
    th.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
