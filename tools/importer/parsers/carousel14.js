/* global WebImporter */
export default function parse(element, { document }) {
  // Only process carousel blocks
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Table header row
  const headerRow = ['Carousel (carousel14)'];
  const rows = [headerRow];

  // Get all slide items
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  const items = content.querySelectorAll('.cmp-carousel__item');
  items.forEach((item) => {
    // Image cell: find the first img inside the slide
    let imgEl = item.querySelector('img');
    if (!imgEl) return;

    // Try to extract all possible text content from the slide
    // 1. Look for any heading, paragraph, or link inside the slide
    const textCellContent = [];
    // Try to find heading
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      textCellContent.push(heading.cloneNode(true));
    }
    // Try to find paragraphs
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      textCellContent.push(p.cloneNode(true));
    });
    // Try to find links
    const links = item.querySelectorAll('a');
    links.forEach(a => {
      textCellContent.push(a.cloneNode(true));
    });

    // If no heading/paragraph/link, fallback to image alt and title
    if (textCellContent.length === 0) {
      const imgAlt = imgEl.getAttribute('alt') || '';
      const imgTitle = imgEl.getAttribute('title') || '';
      if (imgAlt) {
        const p = document.createElement('p');
        p.textContent = imgAlt;
        textCellContent.push(p);
      } else if (imgTitle) {
        const p = document.createElement('p');
        p.textContent = imgTitle;
        textCellContent.push(p);
      }
    }

    // Add row: [image, text content]
    rows.push([
      imgEl,
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
