/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find hero image: first .image with an <img> in main/top area
  let heroImage = null;
  // Try to find a candidate in the top-level main container .cmp-container > .aem-Grid > .image
  const topContainers = element.querySelectorAll(':scope > .cmp-container');
  for (const container of topContainers) {
    const grid = container.querySelector('.aem-Grid');
    if (grid) {
      const imgBlocks = grid.querySelectorAll(':scope > .image');
      for (const imgBlock of imgBlocks) {
        if (imgBlock.querySelector('img')) {
          heroImage = imgBlock;
          break;
        }
      }
    }
    if (heroImage) break;
  }
  // Fallback: first .image with an img anywhere
  if (!heroImage) {
    const imgBlock = element.querySelector('.image');
    if (imgBlock && imgBlock.querySelector('img')) {
      heroImage = imgBlock;
    }
  }

  // 2. Find title and subtitle from main content area
  let mainTitle = null;
  let byline = null;
  // Find .title .cmp-title in main content: skip byline/author at bottom or in sidebars
  // The main content's first .cmp-container contains the primary info
  let mainContent = null;
  const mainNode = element.querySelector('main.container.responsivegrid');
  if (mainNode) {
    // Find title (h1)
    const titles = mainNode.querySelectorAll('.title .cmp-title');
    for (const title of titles) {
      const h1 = title.querySelector('h1');
      if (h1 && !mainTitle) mainTitle = title;
      const h4 = title.querySelector('h4');
      if (h4 && !byline) byline = title;
    }
    // 3. Find the main article contentfragment (skip h3 title, keep all else)
    const cf = mainNode.querySelector('article.contentfragment, article.cmp-contentfragment');
    if (cf) {
      // Find the actual cmp-contentfragment (could be nested)
      const cfArticle = cf.querySelector('article.cmp-contentfragment') || cf;
      const contentArr = [];
      for (const child of cfArticle.children) {
        if (child.classList.contains('cmp-contentfragment__title')) continue; // skip section title
        // Exclude empty grid wrappers
        if (child.children.length === 1 && child.firstElementChild.classList && child.firstElementChild.classList.contains('aem-Grid')) {
          // This is usually just a wrapper, skip
          continue;
        }
        contentArr.push(child);
      }
      mainContent = contentArr;
    }
  }

  // Fallbacks if needed
  if (!mainTitle) {
    const h1title = element.querySelector('.title .cmp-title h1');
    if (h1title) mainTitle = h1title.closest('.cmp-title');
  }
  if (!byline) {
    const h4byline = element.querySelector('.title .cmp-title h4');
    if (h4byline) byline = h4byline.closest('.cmp-title');
  }
  if (!mainContent) {
    // fallback: just grab all paragraphs in the main
    mainContent = Array.from(element.querySelectorAll('p'));
  }

  // Compose the content cell: [Title, Byline, ...Main Article Content]
  const contentCell = [];
  if (mainTitle) contentCell.push(mainTitle);
  if (byline) contentCell.push(byline);
  if (mainContent && mainContent.length > 0) contentCell.push(...mainContent);

  // Build table: header row, image row, content row
  const cells = [
    ['Hero (hero9)'],
    [heroImage],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
