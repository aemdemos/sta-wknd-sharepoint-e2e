/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-teaser--hero element (the hero block container)
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Get the image (background image)
  let imageEl = null;
  const imageContainer = heroTeaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get all content for the content cell (title, subheading, CTA) as a single cell
  let contentCell = '';
  const contentContainer = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Create a fragment to hold all children (including text nodes)
    const frag = document.createDocumentFragment();
    Array.from(contentContainer.childNodes)
      .forEach(n => {
        if ((n.nodeType === 1 && n.textContent.trim()) || (n.nodeType === 3 && n.textContent.trim())) {
          frag.appendChild(n.cloneNode(true));
        }
      });
    contentCell = frag.childNodes.length ? frag : '';
  }

  // Always build 3 rows: header, image, content
  const headerRow = ['Hero (hero10)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the heroTeaser's parent (the .cmp-container) with the table
  let replaceTarget = heroTeaser.closest('.cmp-container');
  if (!replaceTarget) {
    replaceTarget = heroTeaser;
  }
  replaceTarget.replaceWith(table);
}
