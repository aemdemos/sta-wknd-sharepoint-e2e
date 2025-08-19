/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Hero (hero18)'];

  // --- Extract Hero Image ---
  // Find the first image block inside the topmost grid column
  let heroImage = null;
  const heroImageDiv = element.querySelector('.aem-Grid > .image .cmp-image');
  if (heroImageDiv) heroImage = heroImageDiv;

  // --- Extract Heading, Subheading, and Content ---
  const textElements = [];

  // 1. Main heading (first h1 in .cmp-title)
  const mainHeading = element.querySelector('.cmp-title h1');
  if (mainHeading) textElements.push(mainHeading);

  // 2. Subheading/byline (first h4 in .cmp-title)
  const subHeading = element.querySelector('.cmp-title h4');
  if (subHeading) textElements.push(subHeading);

  // 3. Article intro: All elements before the first h2 (or h3) in the .cmp-contentfragment__elements
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (contentFragment) {
    let stop = false;
    Array.from(contentFragment.childNodes).forEach(child => {
      if (stop) return;
      if (child.nodeType === 1) { // element node
        // If we hit a section heading, stop
        if (child.matches('h2, h3') || (child.querySelector && child.querySelector('h2, h3'))) {
          stop = true;
          return;
        }
        // Add blockquotes, paragraphs, and .cmp-text blocks
        if (child.matches('.cmp-text, blockquote, p')) {
          textElements.push(child);
        } else if (child.classList && child.classList.contains('aem-Grid')) {
          // Drill down into any grid and get .cmp-text, blockquote, p
          Array.from(child.querySelectorAll('.cmp-text, blockquote, p')).forEach(e => textElements.push(e));
        }
      }
    });
  }

  // Compose the table as specified:
  // 1 col x 3 rows: [header], [image], [content]
  const cells = [
    headerRow,
    [heroImage ? heroImage : ''],
    [textElements]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
