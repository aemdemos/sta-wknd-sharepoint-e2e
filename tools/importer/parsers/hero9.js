/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the top hero image (first large image in the main grid at the top)
  let heroImg = null;
  // Try to find the first .cmp-image img that is a direct child of the main aem-Grid
  const mainGrids = element.querySelectorAll('.aem-Grid');
  for (const grid of mainGrids) {
    const img = grid.querySelector('.cmp-image img');
    if (img) {
      heroImg = img;
      break;
    }
  }
  // Fallback: find first .cmp-image img in the whole element
  if (!heroImg) heroImg = element.querySelector('.cmp-image img');

  // 2. Extract heading and byline
  const heading = element.querySelector('h1');
  const byline = element.querySelector('h4');

  // 3. Extract intro content (all the elements in the primary content fragment before the first section heading)
  let introContent = [];
  const contentFragment = element.querySelector('article.contentfragment');
  if (contentFragment) {
    // We'll grab all direct children and inside nested divs until the first h2
    let foundH2 = false;
    const nodes = [];
    for (const child of contentFragment.children) {
      if (foundH2) break;
      if (child.tagName === 'DIV') {
        // search recursively for h2 in child
        for (const node of child.childNodes) {
          // If it's a div, look inside for h2, otherwise include if p/blockquote
          if (node.nodeType === 1) {
            if (node.tagName === 'H2') {
              foundH2 = true;
              break;
            }
            // Accept paragraphs, blockquotes, images, etc.
            if (['P','BLOCKQUOTE','DIV'].includes(node.tagName)) {
              nodes.push(node);
            }
          }
        }
      } else if (child.tagName === 'H2') {
        foundH2 = true;
        break;
      } else {
        nodes.push(child);
      }
    }
    // Remove empty or whitespace-only elements
    introContent = nodes.filter(el => {
      if (el.nodeType === 3) return el.textContent.trim().length > 0;
      if (el.nodeType === 1) return el.textContent.trim().length > 0 || el.tagName === 'IMG';
      return false;
    });
  }

  // Compose content row: heading, byline, then all introContent
  let contentRow = [];
  if (heading) contentRow.push(heading);
  if (byline) contentRow.push(byline);
  if (introContent.length) contentRow.push(...introContent);

  // 4. Build the block table as in the example
  const cells = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [contentRow.length ? contentRow : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the element with the newly structured block
  element.replaceWith(block);
}
