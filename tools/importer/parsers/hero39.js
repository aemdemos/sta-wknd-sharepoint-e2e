/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero39) block parsing

  // 1. Header row
  const headerRow = ['Hero (hero39)'];

  // 2. Extract image (background)
  let imageEl = null;
  // Find the image inside the hero block
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // 3. Extract text content (heading, subheading)
  let headingEl = null;
  let subheadingEl = null;
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    headingEl = contentContainer.querySelector('.cmp-teaser__title');
    // The description may contain a <p>
    const descContainer = contentContainer.querySelector('.cmp-teaser__description');
    if (descContainer) {
      // Use the first child if it's a <p>, otherwise use the container itself
      if (descContainer.firstElementChild && descContainer.firstElementChild.tagName === 'P') {
        subheadingEl = descContainer.firstElementChild;
      } else {
        subheadingEl = descContainer;
      }
    }
  }

  // 4. Build table rows
  // Row 2: image (background)
  const imageRow = [imageEl ? imageEl : ''];

  // Row 3: text content (heading, subheading)
  const textContent = [];
  if (headingEl) textContent.push(headingEl);
  if (subheadingEl) textContent.push(subheadingEl);
  const textRow = [textContent.length ? textContent : ''];

  // 5. Create table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(block);
}
