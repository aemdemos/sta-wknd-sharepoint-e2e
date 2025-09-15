/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main article contentfragment block
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find all h2 titles and their associated images and text
  const slides = [];
  // The contentfragment contains a .cmp-contentfragment__elements > div
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll look for .title + .image pairs inside the cmp-contentfragment__elements
  const gridDivs = cfElements.querySelectorAll('.aem-Grid');
  gridDivs.forEach((grid) => {
    // Find .title and .image children
    const titleDiv = grid.querySelector('.title .cmp-title__text');
    const imageDiv = grid.querySelector('.image img');
    if (imageDiv) {
      // Find all following siblings after .image (within the same parent) that are <p> or .aem-Grid
      // But in this markup, the description is the <p> after the grid's parent
      let descs = [];
      let parent = grid.parentElement;
      let afterGrid = parent.nextElementSibling;
      while (afterGrid) {
        if (afterGrid.tagName === 'P') {
          descs.push(afterGrid.cloneNode(true));
        } else if (afterGrid.classList && afterGrid.classList.contains('aem-Grid')) {
          break;
        }
        afterGrid = afterGrid.nextElementSibling;
      }
      // Compose text cell: title (h2) + all following description <p>s
      const textCell = [];
      if (titleDiv) textCell.push(titleDiv.cloneNode(true));
      descs.forEach(d => textCell.push(d));
      slides.push([imageDiv.cloneNode(true), textCell.length ? textCell : '']);
    }
  });

  // Defensive: If no slides found, do nothing
  if (!slides.length) return;

  // Table header
  const headerRow = ['Carousel (carousel25)'];
  // Compose table rows
  const cells = [headerRow, ...slides];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
