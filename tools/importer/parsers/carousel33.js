/* global WebImporter */
export default function parse(element, { document }) {
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const items = carousel.querySelectorAll('.cmp-carousel__item');
  if (!items.length) return;

  const headerRow = ['Carousel (carousel33)'];
  const rows = [headerRow];

  items.forEach((item) => {
    let imgEl = null;
    const imgContainer = item.querySelector('[data-cmp-is="image"]');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    if (!imgEl) {
      imgEl = item.querySelector('img');
    }
    if (!imgEl) return;

    // Collect all text content in the slide, including headings, paragraphs, and links
    const textCell = document.createElement('div');
    // Headings
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      textCell.appendChild(h);
    }
    // Paragraphs
    item.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        textCell.appendChild(para);
      }
    });
    // Links (CTA)
    item.querySelectorAll('a').forEach((a) => {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent.trim();
      textCell.appendChild(link);
    });
    // If no text found, try caption meta or title/alt
    if (!textCell.hasChildNodes()) {
      const metaCaption = imgContainer ? imgContainer.querySelector('meta[itemprop="caption"]') : null;
      if (metaCaption && metaCaption.content) {
        textCell.textContent = metaCaption.content;
      } else if (imgEl.title) {
        textCell.textContent = imgEl.title;
      } else if (imgEl.alt) {
        textCell.textContent = imgEl.alt;
      }
    }

    rows.push([imgEl, textCell]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
