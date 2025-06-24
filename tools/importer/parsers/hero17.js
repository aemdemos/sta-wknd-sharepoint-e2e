/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main hero image block (first .cmp-image in the top layout grid)
  let heroImage = null;
  // Get the first .cmp-image that's a direct descendant of the main grid (as in the example)
  const mainImageCandidate = element.querySelector('.aem-Grid > .image .cmp-image');
  if (mainImageCandidate) {
    heroImage = mainImageCandidate;
  }
  
  // 2. Gather the hero text content block (heading, byline, intro)
  // In example, this is the heading (h1) and the first paragraph after it
  let heroContent = [];
  
  // Find the main heading (h1)
  const mainHeading = element.querySelector('h1');
  if (mainHeading) heroContent.push(mainHeading);
  
  // Find a byline or sub-heading (h4 directly after h1)
  let byline = null;
  if (mainHeading) {
    // Look for the next h4 after h1 (often the author)
    let n = mainHeading.parentElement;
    while (n && n.nextElementSibling) {
      n = n.nextElementSibling;
      const h4 = n.querySelector && n.querySelector('h4');
      if (h4) {
        byline = h4;
        break;
      }
      // stop at the contentfragment/article
      if (n.matches && n.matches('article, .contentfragment')) break;
    }
    if (byline) heroContent.push(byline);
  }
  
  // Find the first content paragraph for intro (either before or in contentfragment)
  let firstParagraph = null;
  // Try first p after the title block(s)
  // In this markup, the first paragraph is inside the .cmp-contentfragment
  const fragment = element.querySelector('article.contentfragment');
  if (fragment) {
    firstParagraph = fragment.querySelector('p');
  }
  if (firstParagraph && !heroContent.includes(firstParagraph)) {
    heroContent.push(firstParagraph);
  }

  // Compose block table as per the markdown example
  // 1 column, 3 rows: ['Hero'] / [image] / [content]
  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [heroContent.length ? heroContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  
  // Replace the original element with the hero table
  element.replaceWith(table);
}
