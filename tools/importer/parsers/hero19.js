/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first big image at the top (background for Hero)
  // Look for the first image inside the main > div > div structure
  let heroImg = null;
  // The first .cmp-image img in the top-most grid/div is the hero image
  const heroImageDiv = element.querySelector('.cmp-image img');
  if (heroImageDiv) {
    heroImg = heroImageDiv;
  }

  // Find the main title for the Hero block (should be the first h1 under .cmp-title)
  let heroTitle = null;
  const mainTitleDiv = element.querySelector('h1.cmp-title__text');
  if (mainTitleDiv) {
    heroTitle = mainTitleDiv;
  }

  // Assemble table rows according to the markdown example
  const cells = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [heroTitle ? heroTitle : '']
  ];

  // Create the table block and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
