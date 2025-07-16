/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Overview tab panel (the one labeled 'Overview' or the first tabpanel)
  function getOverviewTabPanel(el) {
    const tabPanels = el.querySelectorAll('.cmp-tabs__tabpanel');
    // Try to find the overview tab by aria-labelledby and tab textContent
    for (const panel of tabPanels) {
      const labelledBy = panel.getAttribute('aria-labelledby');
      if (labelledBy) {
        const tab = el.querySelector(`#${labelledBy}`);
        if (tab && tab.textContent.trim().toLowerCase() === 'overview') {
          return panel;
        }
      }
    }
    // Otherwise, use the first panel
    if (tabPanels.length > 0) return tabPanels[0];
    return null;
  }

  // Get first image block in overview tab panel
  function getHeroImage(panel) {
    if (!panel) return null;
    // Prefer full block .cmp-image
    const cmpImage = panel.querySelector('.cmp-image');
    if (cmpImage) return cmpImage;
    // Else any first img
    const img = panel.querySelector('img');
    return img || null;
  }

  // Get the main heading at top (h1 or .cmp-title__text as h1)
  function getHeroHeading(el) {
    // Try to find h1 in child .cmp-title or .title divs
    // Use :scope>div .cmp-title__text or h1
    const titles = el.querySelectorAll(':scope > div .cmp-title__text, :scope > div h1');
    for (const t of titles) {
      if (t.textContent && t.textContent.trim().length > 0) return t;
    }
    // fallback: any h1
    const h1 = el.querySelector('h1');
    if (h1 && h1.textContent.trim().length > 0) return h1;
    return null;
  }

  // Get all text blocks from overview panel, maintaining DOM order
  function getTextBlocks(panel, usedImage) {
    if (!panel) return [];
    // Use the main article if present
    const article = panel.querySelector('article') || panel;
    // Get all elements with text content: headings, paragraphs, lists, but not images
    const tags = ['H1','H2','H3','H4','H5','H6','P','UL','OL'];
    const blocks = [];
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        // skip the image if already referenced for image row
        if (usedImage && usedImage.contains && usedImage.contains(node)) return NodeFilter.FILTER_SKIP;
        if (tags.includes(node.tagName) && node.textContent.trim().length > 0) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      }
    });
    let n;
    while ((n = walker.nextNode())) {
      blocks.push(n);
    }
    return blocks;
  }

  // Compose rows
  const headerRow = ['Hero (hero30)'];

  const overviewPanel = getOverviewTabPanel(element);
  const heroImage = getHeroImage(overviewPanel);
  const imageRow = [heroImage ? heroImage : ''];

  // Text row: main heading from top of source (not from panel), then all text blocks from overview panel
  const heroHeading = getHeroHeading(element);
  const textBlocks = getTextBlocks(overviewPanel, heroImage);
  const rowContent = [];
  if (heroHeading) rowContent.push(heroHeading);
  rowContent.push(...textBlocks);
  const textRow = [rowContent.length > 0 ? rowContent : ''];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
