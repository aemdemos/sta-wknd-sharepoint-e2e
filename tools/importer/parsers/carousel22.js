/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel main wrapper
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;

  // Get all slides
  const slides = cmpCarousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');

  // Rows for slides
  const rows = [];
  slides.forEach((slide) => {
    // IMAGE CELL
    let imgEl = null;
    const imgWrapper = slide.querySelector('.cmp-teaser__image');
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }
    // TEXT CELL
    const textContent = [];
    const titleEl = slide.querySelector('.cmp-teaser__title');
    if (titleEl) textContent.push(titleEl);
    const descEl = slide.querySelector('.cmp-teaser__description');
    if (descEl) {
      if (descEl.children.length > 0) {
        Array.from(descEl.childNodes).forEach((node) => {
          textContent.push(node);
        });
      } else {
        const p = document.createElement('p');
        p.innerHTML = descEl.innerHTML;
        textContent.push(p);
      }
    }
    const ctaEl = slide.querySelector('.cmp-teaser__action-link');
    if (ctaEl) textContent.push(ctaEl);
    rows.push([imgEl || '', textContent.length > 0 ? textContent : '']);
  });

  // Create the table manually to set header colspan=2
  const table = document.createElement('table');
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.setAttribute('colspan', '2');
  headerTh.textContent = 'Carousel (carousel22)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((cell) => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (Array.isArray(cell)) {
        cell.forEach((c) => td.append(c));
      } else if (cell) {
        td.append(cell);
      }
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  element.replaceWith(table);
}
