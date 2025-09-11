/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row (must match block name exactly)
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];

  // For each slide, extract image and text content
  items.forEach((item) => {
    // Find image (mandatory)
    let imgEl = item.querySelector('img');
    if (!imgEl) return; // Defensive: skip if no image

    // Try to extract all text content from the slide
    let textCellContent = [];
    // Look for any heading, paragraph, span, strong, b, a, and meta caption
    // 1. Headings
    let heading = null;
    for (let i = 1; i <= 6; i++) {
      heading = item.querySelector('h' + i);
      if (heading) break;
    }
    if (!heading) {
      heading = item.querySelector('strong, b');
    }
    if (heading) textCellContent.push(heading.cloneNode(true));

    // 2. Paragraphs and spans
    const paragraphs = Array.from(item.querySelectorAll('p, span'));
    paragraphs.forEach(p => {
      // Avoid duplicating heading if it's a span/paragraph
      if (!heading || !heading.contains(p)) {
        textCellContent.push(p.cloneNode(true));
      }
    });

    // 3. Meta caption (if present and not already included)
    const metaCaption = item.querySelector('meta[itemprop="caption"]');
    if (metaCaption && metaCaption.content) {
      // Only add if not already present
      const alreadyHasCaption = textCellContent.some(el => el.textContent && el.textContent.trim() === metaCaption.content.trim());
      if (!alreadyHasCaption) {
        const p = document.createElement('p');
        p.textContent = metaCaption.content;
        textCellContent.push(p);
      }
    }

    // 4. Links (CTA)
    const links = Array.from(item.querySelectorAll('a[href]'));
    links.forEach(a => textCellContent.push(a.cloneNode(true)));

    // If no text content, leave cell empty
    const textCell = textCellContent.length > 0 ? textCellContent : '';

    // Add row: [image, text]
    rows.push([imgEl.cloneNode(true), textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
