/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  let heroTeaser = element.querySelector('.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Within the hero, find the cmp-teaser
  const cmpTeaser = heroTeaser.querySelector('.cmp-teaser');
  if (!cmpTeaser) return;

  // Get the hero image (as an <img> element)
  let heroImg = null;
  const heroImageContainer = cmpTeaser.querySelector('.cmp-teaser__image');
  if (heroImageContainer) {
    const cmpImage = heroImageContainer.querySelector('.cmp-image');
    if (cmpImage) {
      heroImg = cmpImage.querySelector('img');
    }
  }

  // Get the hero content (title, subtitle, etc)
  let contentElements = [];
  const contentDiv = cmpTeaser.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Only non-empty nodes
    contentElements = Array.from(contentDiv.childNodes).filter(node => {
      if (node.nodeType === 1) return true; // element node
      if (node.nodeType === 3 && node.textContent.trim().length) return true; // text node with non-whitespace
      return false;
    });
  }

  // Table: 1 column, 3 rows (header, image, content)
  const cells = [
    ['Hero (hero12)'],
    [heroImg ? heroImg : ''],
    [contentElements.length ? contentElements : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
