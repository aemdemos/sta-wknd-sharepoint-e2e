/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container with the hero teaser
  const mainHeroContainer = element.querySelector(':scope > div');
  if (!mainHeroContainer) return;

  // Find the teaser block (with image and content)
  const teaser = mainHeroContainer.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract the hero image (from .cmp-teaser__image > img)
  let heroImg = null;
  const imageDiv = teaser.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    heroImg = imageDiv.querySelector('img');
  }

  // Extract the hero heading (from .cmp-teaser__content, looking for the heading)
  const contentDiv = teaser.querySelector('.cmp-teaser__content');
  let heroHeading = null;
  if (contentDiv) {
    // Use the *first* heading element found (any level)
    heroHeading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Prepare block table as per example: header, image (row2), heading (row3)
  // Use empty string in cell if not present for resilience
  const cells = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [heroHeading ? heroHeading : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
