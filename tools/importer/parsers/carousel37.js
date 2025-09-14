/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the carousel content block
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all carousel items (slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;
  const items = Array.from(content.querySelectorAll('.cmp-carousel__item'));

  // Table header row
  const headerRow = ['Carousel (carousel37)'];
  const rows = [headerRow];

  // For each slide, extract image and (if present) text content
  items.forEach((item) => {
    // Image: find the first img inside the slide
    let imgEl = item.querySelector('img');
    let imageCell = imgEl ? imgEl : '';

    // Try to find any text content in the slide (title, description, CTA)
    // We'll look for headings, paragraphs, and links inside the slide
    let textParts = [];
    // Headings
    const heading = item.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h = document.createElement('h2');
      h.textContent = heading.textContent.trim();
      textParts.push(h);
    }
    // Paragraphs
    const paragraphs = item.querySelectorAll('p');
    paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.textContent = p.textContent.trim();
      textParts.push(pEl);
    });
    // Links (CTA)
    const links = item.querySelectorAll('a');
    links.forEach(a => {
      const aEl = document.createElement('a');
      aEl.href = a.href;
      aEl.textContent = a.textContent.trim();
      textParts.push(aEl);
    });
    // If no structured text, try to get any text nodes directly under the item
    if (textParts.length === 0) {
      const textContent = item.textContent.trim();
      if (textContent) {
        textParts.push(textContent);
      }
    }
    // Always add a second cell (empty if no text content, as required by block)
    rows.push([imageCell, textParts.length ? textParts : '']);
  });

  // Ensure all rows (except header) have exactly 2 columns
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length < 2) rows[i].push('');
    if (rows[i].length > 2) rows[i] = rows[i].slice(0, 2);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
