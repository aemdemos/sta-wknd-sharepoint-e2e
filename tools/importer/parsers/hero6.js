/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block (deepest .cmp-teaser inside the main container)
  const heroTeaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!heroTeaser) return;

  // Find background image (second row)
  let imageEl = null;
  const imgContainer = heroTeaser.querySelector('.cmp-teaser__image');
  if (imgContainer) {
    // Only the <img>, as required by the block definition
    imageEl = imgContainer.querySelector('img');
  }

  // Find headline and supporting content (third row)
  const contentContainer = heroTeaser.querySelector('.cmp-teaser__content');
  let contentParts = [];
  if (contentContainer) {
    // Push all children that are element nodes
    for (let i = 0; i < contentContainer.children.length; i++) {
      const child = contentContainer.children[i];
      contentParts.push(child);
    }
  }

  // Create table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentParts.length ? contentParts : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
