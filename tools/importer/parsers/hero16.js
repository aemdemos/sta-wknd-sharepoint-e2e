/* global WebImporter */
export default function parse(element, { document }) {
  // Get the first hero image (should be the large image at the top)
  const firstHeroImage = element.querySelector('.cmp-image img');
  // Defensive: if there's no hero image, cell should be blank
  const imageCell = firstHeroImage || '';

  // Get the main title in hero (should be a main h1, styled prominent)
  // Only use the first h1, not byline or article titles
  const mainHeading = element.querySelector('h1');
  const headingCell = mainHeading || '';

  // Compose the table according to the example (header, image, heading)
  const cells = [
    ['Hero'],
    [imageCell],
    [headingCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the hero block table only
  element.replaceWith(table);
}
