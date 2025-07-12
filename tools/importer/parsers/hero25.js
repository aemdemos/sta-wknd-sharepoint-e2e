/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  let heroTeaser = null;
  // Look for .cmp-teaser--hero or .cmp-teaser (top-level)
  const cmpContainers = element.querySelectorAll('.cmp-container');
  for (const container of cmpContainers) {
    const teaser = container.querySelector('.cmp-teaser--hero, .cmp-teaser');
    if (teaser) {
      heroTeaser = teaser;
      break;
    }
  }
  if (!heroTeaser) {
    heroTeaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  }
  if (!heroTeaser) return;
  // 1. Header row
  const headerRow = ['Hero (hero25)'];

  // 2. Background image row
  let bgImg = '';
  const teaserImage = heroTeaser.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    const realImg = teaserImage.querySelector('img');
    if (realImg) {
      bgImg = realImg;
    }
  }

  // 3. Content row
  // The content is inside .cmp-teaser__content
  let contentCell = '';
  const contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Collect heading(s)
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    // Collect everything else (subheading, CTA, etc.)
    // We'll take all children except heading, if present
    const contentElements = [];
    if (heading) contentElements.push(heading);
    // Now get all children except heading
    Array.from(contentDiv.children).forEach((child) => {
      if (child !== heading) {
        contentElements.push(child);
      }
    });
    if (contentElements.length > 0) {
      contentCell = contentElements;
    }
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [bgImg],
    [contentCell],
  ], document);

  element.replaceWith(table);
}
