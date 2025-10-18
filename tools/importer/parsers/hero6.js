/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image (background image)
  let heroImg = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    heroImg = teaserImageDiv.querySelector('img');
  }

  // Find the main heading text
  let heroHeading = null;
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    heroHeading = teaserContentDiv.querySelector('h1, h2, .cmp-teaser__title');
  }

  // Compose table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [heroImg ? heroImg : ''];
  const contentRow = [heroHeading ? heroHeading : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Find the separator (hr) after the hero section
  let separator = null;
  // Look for the <hr> after the hero block, but only if it is a direct sibling
  let next = element.nextElementSibling;
  while (next) {
    if (next.querySelector && next.querySelector('.cmp-separator__horizontal-rule')) {
      separator = next.querySelector('.cmp-separator__horizontal-rule').cloneNode(true);
      break;
    }
    next = next.nextElementSibling;
  }

  // Replace the original element with the block table and hr if found
  if (separator) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(block);
    fragment.appendChild(separator);
    element.replaceWith(fragment);
  } else {
    element.replaceWith(block);
  }
}
