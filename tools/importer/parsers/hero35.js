/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the top background image (the prominent .cmp-image at the top of the element)
  let backgroundImg = null;
  // Grab the first .cmp-image inside .image container (topmost, not author etc)
  const imgContainers = element.querySelectorAll('.image .cmp-image');
  if (imgContainers.length) {
    backgroundImg = imgContainers[0];
  }

  // 2. Find the main content column containing title(s) and content
  // Look for main.container > div > main.container (avoid outermost main)
  let mainContent = null;
  const mains = element.querySelectorAll('main.container');
  for (const m of mains) {
    // The main section containing an h1 is the primary content section
    if (m.querySelector('h1')) {
      mainContent = m;
      break;
    }
  }

  // 3. Get title (h1) and subheading (h4), referencing existing elements
  let titleEl = null;
  let subheadingEl = null;
  if (mainContent) {
    const cmpTitles = mainContent.querySelectorAll('.cmp-title');
    if (cmpTitles.length > 0) {
      titleEl = cmpTitles[0];
      if (cmpTitles.length > 1) {
        subheadingEl = cmpTitles[1];
      }
    }
  }

  // 4. Gather ALL content (headings, paragraphs, inline images, etc) from the content fragment
  // This matches all visual content under the title
  let contentEls = [];
  if (mainContent) {
    // Find the first .cmp-contentfragment__elements within mainContent
    const contentFragment = mainContent.querySelector('.cmp-contentfragment__elements');
    if (contentFragment) {
      // We want to gather all direct children (p, div with images, etc) in order
      for (const node of contentFragment.children) {
        // Ignore empty grid containers, but keep any element with text or images
        if (
          node.tagName === 'DIV' &&
          node.querySelector('img')
        ) {
          contentEls.push(node);
        } else if (node.tagName === 'P' && node.textContent.trim()) {
          contentEls.push(node);
        }
      }
    }
  }

  // 5. Compose the cell for row 3: title, subheading, all content elements
  const cellContent = [];
  if (titleEl) cellContent.push(titleEl);
  if (subheadingEl) cellContent.push(subheadingEl);
  if (contentEls.length) cellContent.push(...contentEls);

  // 6. Build block table structure as per spec
  const cells = [
    ['Hero (hero35)'],
    [backgroundImg ? backgroundImg : ''],
    [cellContent.length ? cellContent : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
