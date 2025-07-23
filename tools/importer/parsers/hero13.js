/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!heroTeaser) return;

  // Get the image element
  let imgEl = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    // Reference the actual <img> (not clone)
    imgEl = imageWrapper.querySelector('img');
  }

  // Get the text content (headline, subheadline, CTA, etc)
  let textContent = null;
  const contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentDiv && contentDiv.childNodes.length) {
    // If there's only one child, just reference that
    if (contentDiv.childNodes.length === 1) {
      textContent = contentDiv.firstElementChild || contentDiv.firstChild;
    } else {
      // Reference the content div itself (to get all content/structure)
      textContent = contentDiv;
    }
  }

  // Build the table in the required structure
  const cells = [
    ['Hero (hero13)'],
    [imgEl || ''],
    [textContent || '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
