/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment/article that contains the accordion data
  const contentFragment = element.querySelector('article.contentfragment, .contentfragment, [class*="contentfragment"]');
  if (!contentFragment) return;

  // Use cmp-contentfragment__elements if it exists, otherwise use contentFragment
  let cfMain = contentFragment;
  const cfElementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (cfElementsContainer) {
    cfMain = cfElementsContainer;
  }

  // Gather all children of cfMain in order
  const children = Array.from(cfMain.children);
  // The accordion begins with the first <h2>
  let startIdx = children.findIndex(el => el.tagName === 'H2');
  if (startIdx === -1) return; // No accordion if no H2

  // Prepare accordion rows
  const rows = [];
  let idx = startIdx;
  while (idx < children.length) {
    if (children[idx].tagName !== 'H2') {
      idx++;
      continue;
    }
    // Title cell is the H2
    const titleElem = children[idx];
    idx++;
    // Gather all elements until next <h2> or end
    const contentNodes = [];
    while (idx < children.length && children[idx].tagName !== 'H2') {
      const el = children[idx];
      // If this is an image grid, include all images directly
      if (
        el.tagName === 'DIV' &&
        el.querySelector('.cmp-image')
      ) {
        // Add all image elements
        const imageDivs = Array.from(el.querySelectorAll(':scope > .image .cmp-image'));
        if (imageDivs.length > 0) {
          contentNodes.push(...imageDivs);
        }
      } else if (el.tagName === 'P' || el.tagName === 'DIV') {
        // For <p> and any divs that are not empty, but skip empty grid wrappers
        // Only add non-empty divs (not just .aem-Grid wrappers)
        if (el.tagName === 'DIV' && el.classList.contains('aem-Grid') && el.children.length === 0) {
          // skip empty grid
        } else {
          contentNodes.push(el);
        }
      }
      idx++;
    }
    // If there are multiple content nodes, keep them as array, otherwise single
    rows.push([
      titleElem,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  }

  // Compose cells for the table block
  const cells = [
    ['Accordion (accordion16)'],
    ...rows
  ];

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original content fragment with the block
  contentFragment.replaceWith(block);
}