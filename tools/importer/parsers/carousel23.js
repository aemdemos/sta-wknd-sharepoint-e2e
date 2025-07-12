/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find carousel main container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 2. Find all carousel item slides
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // 3. Table header should exactly match the example
  const headerRow = ['Carousel (carousel23)'];

  // 4. Build each slide row
  const rows = [headerRow];
  items.forEach(item => {
    // --- IMAGE CELL ---
    let imageElem = null;
    const teaserImage = item.querySelector('.cmp-teaser__image [data-cmp-is="image"] img');
    if (teaserImage) {
      imageElem = teaserImage;
    }

    // --- TEXT CELL ---
    const textArr = [];
    // Heading
    const title = item.querySelector('.cmp-teaser__title');
    if (title) {
      textArr.push(title);
    }
    // Description (can contain <p> or just text)
    const desc = item.querySelector('.cmp-teaser__description');
    if (desc) {
      // If desc contains only a <p>, use that; else use the whole desc div
      if (desc.children.length === 1 && desc.firstElementChild.tagName.toLowerCase() === 'p') {
        textArr.push(desc.firstElementChild);
      } else {
        textArr.push(desc);
      }
    }
    // CTA (link) - must be included at the end if present
    const cta = item.querySelector('.cmp-teaser__action-link');
    if (cta) {
      textArr.push(cta);
    }
    // Compose text cell
    let textCell = textArr.length === 1 ? textArr[0] : textArr;
    // Add row to table
    rows.push([imageElem, textCell]);
  });

  // 5. Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
