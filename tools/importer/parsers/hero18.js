/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, matches example
  const headerRow = ['Hero (hero18)'];

  // 1. Find the hero/banner image (top-of-page image)
  // Look for the first .cmp-image img in the first .cmp-container > .aem-Grid
  let heroImg = null;
  const topContainer = element.querySelector('.cmp-container');
  if (topContainer) {
    const topGrid = topContainer.querySelector('.aem-Grid');
    if (topGrid) {
      const imgEl = topGrid.querySelector('.cmp-image img');
      if (imgEl) {
        heroImg = imgEl;
      }
    }
  }
  // Fallback: first .cmp-image img in element
  if (!heroImg) {
    heroImg = element.querySelector('.cmp-image img');
  }

  // 2. Find the main heading/block title and subheading
  // Get all .cmp-title__text elements (these are h1, h4, etc.)
  // Only those at the beginning of the main content area
  let mainTitleEls = [];
  // Try to find the 'main' content area containing titles and intro
  let mainContentArea = null;
  // The correct main container is the one with the <h1> title, not the outermost
  const mainCandidates = element.querySelectorAll('main.container.responsivegrid');
  for (const main of mainCandidates) {
    if (main.querySelector('h1') || main.querySelector('.cmp-title__text')) {
      mainContentArea = main;
      break;
    }
  }
  // Fallback: just use the element
  if (!mainContentArea) mainContentArea = element;

  // Get block's <h1>, <h4> etc. in order
  const titleEls = Array.from(mainContentArea.querySelectorAll('.cmp-title__text'));
  if (titleEls.length) {
    mainTitleEls = titleEls;
  }

  // 3. Find the intro/lead paragraph directly after the main titles
  let introPara = null;
  if (mainTitleEls.length > 0) {
    // Find first <p> after the last main title
    const lastTitle = mainTitleEls[mainTitleEls.length - 1];
    // Search siblings after the lastTitle
    let searchNode = lastTitle.parentElement;
    while (searchNode && searchNode.nextElementSibling) {
      searchNode = searchNode.nextElementSibling;
      if (searchNode.tagName === 'P') {
        introPara = searchNode;
        break;
      }
      // Dive into divs
      if (searchNode.querySelector) {
        const para = searchNode.querySelector('p');
        if (para) {
          introPara = para;
          break;
        }
      }
    }
  }
  // Fallback: first <p> in mainContentArea
  if (!introPara) {
    introPara = mainContentArea.querySelector('p');
  }

  // Compose the hero text content for the block
  // According to the example, the second row should contain: Heading, subheading(s), intro paragraph
  // Put all in one cell as array of elements, in order
  const heroText = [];
  if (mainTitleEls.length) {
    heroText.push(...mainTitleEls);
  }
  if (introPara && !heroText.includes(introPara)) {
    heroText.push(introPara);
  }

  // 4. Compose the table for the block
  const cells = [
    headerRow,
    [heroImg ? heroImg : ''],
    [heroText.length ? heroText : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
