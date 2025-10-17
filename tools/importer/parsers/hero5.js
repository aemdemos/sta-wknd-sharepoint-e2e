/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero5)'];

  // Defensive: Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');

  // Find the image (background image)
  let imageEl = null;
  if (teaser) {
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
  }

  // Find the heading/title
  let titleEl = null;
  if (teaser) {
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      const heading = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        // Trim whitespace from textContent and create a new heading element
        const trimmedText = heading.textContent.trim();
        titleEl = document.createElement(heading.tagName.toLowerCase());
        titleEl.textContent = trimmedText;
      }
    }
  }

  // Compose table cells (no separator row)
  const cells = [
    headerRow,
    [imageEl ? imageEl : ''],
    [titleEl ? titleEl : ''],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Find the horizontal separator
  let hrEl = element.querySelector('.cmp-separator__horizontal-rule');
  if (!hrEl) {
    hrEl = element.querySelector('hr');
  }
  const hrClone = hrEl ? hrEl.cloneNode(true) : null;

  // Create a wrapper to hold both block and separator
  const wrapper = document.createElement('div');
  wrapper.appendChild(block);
  if (hrClone) {
    wrapper.appendChild(hrClone);
  }

  // Replace the original element with the wrapper
  element.replaceWith(wrapper);
}
