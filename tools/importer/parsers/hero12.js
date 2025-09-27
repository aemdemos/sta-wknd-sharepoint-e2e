/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root: the .cmp-container containing .cmp-teaser--hero
  const heroRoot = element.querySelector('.cmp-container .cmp-teaser--hero')?.closest('.cmp-container');
  if (!heroRoot) return;

  // Find the image (background image)
  let imageEl = null;
  const teaserHero = heroRoot.querySelector('.cmp-teaser--hero');
  if (teaserHero) {
    const imageContainer = teaserHero.querySelector('.cmp-teaser__image .cmp-image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // Find all content for the third row: title, subheading, CTA
  let contentCell = '';
  if (teaserHero) {
    const teaserContent = teaserHero.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Collect all children (headings, paragraphs, links, etc.)
      const children = Array.from(teaserContent.children);
      if (children.length > 0) {
        contentCell = children.map(child => child.cloneNode(true));
      }
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell && contentCell.length ? contentCell : ''];

  // Always ensure 3 rows (header, image, content)
  const rows = [headerRow, imageRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(rows, document);

  heroRoot.replaceWith(table);
}
