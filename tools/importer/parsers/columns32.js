/* global WebImporter */
export default function parse(element, { document }) {
  // The goal: extract two main columns as in the example markdown (main/article content and sidebar).
  // Header row must be: ['Columns (columns32)'] exactly.
  
  // 1. Locate the main content (article + top image + byline, all as one column)
  // 2. Locate the sidebar (the <aside> element)

  // Find the first main image (top hero image)
  const firstImage = element.querySelector('.cmp-image .cmp-image__image');
  const heroImageDiv = firstImage ? firstImage.closest('.cmp-image') : null;

  // Find the breadcrumb (for context, above article title)
  const breadcrumb = element.querySelector('nav.cmp-breadcrumb');

  // Find the main magazine article content (titles, paragraphs, etc)
  // The inner-most container that holds all article content (excluding aside/sidebar)
  // This is a 'main.container' with a child '.cmp-container' that contains the article sequence
  let mainArticleContainer = null;
  const mainCandidates = element.querySelectorAll('main.container');
  for (const c of mainCandidates) {
    const hasContentFragment = c.querySelector('.cmp-contentfragment');
    if (hasContentFragment) {
      mainArticleContainer = c;
      break;
    }
  }
  // Now, find the byline/author experience fragment (not in the aside)
  const byline = element.querySelector('.cmp-experiencefragment');

  // Compose the left/main column content in logical article order
  const leftColumnContent = [];
  if (heroImageDiv) leftColumnContent.push(heroImageDiv);
  if (breadcrumb) leftColumnContent.push(breadcrumb);
  if (mainArticleContainer) leftColumnContent.push(mainArticleContainer);
  if (byline) leftColumnContent.push(byline);

  // Find the sidebar (right column)
  const aside = element.querySelector('aside.container');
  const rightColumnContent = [];
  if (aside) rightColumnContent.push(aside);

  // Compose the table cells array as per block guidelines
  const cells = [
    ['Columns (columns32)'],
    [leftColumnContent, rightColumnContent],
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
