/* global WebImporter */
export default function parse(element, { document }) {
  // Find the teaser block inside the container
  const teaser = element.querySelector('.cmp-teaser');

  // Find image element for background image
  let img = '';
  const imgElem = teaser && teaser.querySelector('.cmp-teaser__image img');
  if (imgElem) {
    img = imgElem;
  }

  // Find the heading text (as a heading element)
  let heading = '';
  const headingElem = teaser && teaser.querySelector('.cmp-teaser__content .cmp-teaser__title');
  if (headingElem) {
    // Create a heading element for semantic correctness (use h2 if that's in the source)
    // We want to reference the actual element from the DOM, not its text
    heading = headingElem;
  }

  // Compose the table according to the markdown example: 1 column, 3 rows
  const cells = [
    ['Hero'],
    [img],
    [heading],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
