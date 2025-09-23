/* global WebImporter */
export default function parse(element, { document }) {
  function getCarouselRows(carouselContent) {
    const rows = [];
    const items = carouselContent.querySelectorAll(':scope > div.cmp-carousel__item');
    items.forEach((item) => {
      let imgEl = item.querySelector('.cmp-image__image');
      if (!imgEl) imgEl = item.querySelector('img');
      if (!imgEl) return;

      const textCell = document.createElement('div');
      const textNodes = [];
      item.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => textNodes.push(h.cloneNode(true)));
      item.querySelectorAll('p').forEach(p => textNodes.push(p.cloneNode(true)));
      item.querySelectorAll('span, div').forEach(el => {
        if (el.textContent.trim() && !el.querySelector('img')) {
          textNodes.push(el.cloneNode(true));
        }
      });
      item.querySelectorAll('a').forEach(a => textNodes.push(a.cloneNode(true)));
      if (textNodes.length === 0) {
        const dataLayer = item.getAttribute('data-cmp-data-layer');
        if (dataLayer) {
          try {
            const data = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
            const keys = Object.keys(data);
            if (keys.length && data[keys[0]].dc && data[keys[0]].dc.title) {
              const h = document.createElement('h2');
              h.textContent = data[keys[0]].dc.title;
              textNodes.push(h);
            }
          } catch (e) {}
        }
      }
      textNodes.forEach(n => textCell.appendChild(n));
      // Only push a second column if there is text content
      if (textCell.childNodes.length) {
        rows.push([imgEl, textCell]);
      } else {
        rows.push([imgEl]);
      }
    });
    return rows;
  }

  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) return;

  const headerRow = ['Carousel (carousel8)'];
  const slideRows = getCarouselRows(carouselContent);
  // Only add a second column if there is text content for that slide
  const cells = [headerRow, ...slideRows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
