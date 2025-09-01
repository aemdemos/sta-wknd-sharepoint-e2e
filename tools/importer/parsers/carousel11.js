/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block expects header row then slide rows: [image, text]
  const headerRow = ['Carousel (carousel11)'];
  const rows = [headerRow];

  // Locate the main .cmp-contentfragment element
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all .aem-Grid that represent carousel slides: must contain both a .cmp-image and a .cmp-title--underline
  const grids = Array.from(cfElements.querySelectorAll('.aem-Grid')).filter(grid =>
    grid.querySelector('.cmp-image') && grid.querySelector('.cmp-title--underline')
  );

  grids.forEach(grid => {
    // Get image
    const imageEl = grid.querySelector('.cmp-image');

    // Compose text cell with all relevant content
    const textCell = [];

    // Add the heading
    const heading = grid.querySelector('.cmp-title--underline h2, .cmp-title--underline h3');
    if (heading) textCell.push(heading);

    // Collect all descriptive content after this grid's parent <div> and before the next .aem-Grid (slide)
    const gridContainer = grid.parentElement;
    let sibling = gridContainer.nextSibling;
    while (sibling && !(sibling.nodeType === 1 && sibling.classList.contains('aem-Grid'))) {
      if (sibling.nodeType === 1) {
        // Only include non-empty elements
        if (sibling.textContent && sibling.textContent.trim().length > 0) {
          textCell.push(sibling);
        }
      }
      sibling = sibling.nextSibling;
    }

    // Fallback if no text content was found
    if (textCell.length === 0) {
      // Include a blank span to maintain cell structure
      textCell.push(document.createElement('span'));
    }

    // Ensure image is referenced and not missing
    rows.push([imageEl, textCell]);
  });

  // Only create the table if there are slides
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
