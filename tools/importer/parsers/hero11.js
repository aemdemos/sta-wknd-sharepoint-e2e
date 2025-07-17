/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-teaser block which contains the hero content
  const teaser = element.querySelector('.cmp-teaser');
  let imageEl = null;
  let textContent = [];

  if (teaser) {
    // Find the image inside the teaser
    const cmpImage = teaser.querySelector('.cmp-image');
    if (cmpImage) {
      imageEl = cmpImage.querySelector('img');
    }

    // Find the heading/title
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content && content.children.length > 0) {
      // Collect all children (could be headings, paragraphs, etc)
      // For this input only heading is present, but generically, support more
      textContent = Array.from(content.children);
    }
  }

  // Compose cells array. If image or textContent is missing, provide empty string for cell.
  const cells = [
    ['Hero (hero11)'],
    [imageEl ? imageEl : ''],
    [textContent.length > 0 ? textContent : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
