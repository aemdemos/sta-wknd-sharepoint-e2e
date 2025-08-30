/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-contentfragment__elements section (main article body)
  const cfElements = element.querySelector('.cmp-contentfragment__elements') || element;

  // Identify all .aem-Grid blocks that have an image; these will be our slide containers
  const grids = Array.from(cfElements.querySelectorAll('.aem-Grid')).filter(g => g.querySelector('.image img'));

  const slides = grids.map(grid => {
    // Get the image element
    const img = grid.querySelector('.image img');

    // Get the heading (h2-h6) inside the grid
    const heading = grid.querySelector('h2, h3, h4, h5, h6');

    // Gather all <p>, .cmp-text, and blockquotes that are siblings AFTER this grid (until next grid or end)
    let cell2 = [];
    let after = grid.nextElementSibling;
    while (after && !after.classList.contains('aem-Grid')) {
      // Only add elements that contain meaningful text content
      if (
        after.tagName === 'P' ||
        after.classList.contains('cmp-text') ||
        after.tagName === 'BLOCKQUOTE' ||
        after.querySelector('blockquote')
      ) {
        cell2.push(after);
      }
      after = after.nextElementSibling;
    }
    // Also include blockquotes and .cmp-text within the grid (e.g. if special text blocks or quotes inside the grid)
    grid.querySelectorAll('blockquote, .cmp-text').forEach(el => {
      if (!cell2.includes(el)) cell2.push(el);
    });
    // Prepend the heading if present
    if (heading) cell2.unshift(heading);
    // If no text at all, use an empty string
    if (!cell2.length) cell2 = [''];
    return [img, cell2];
  });

  if (!slides.length) return;

  // The header must match the example exactly
  const cells = [['Carousel (carousel25)'], ...slides];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
