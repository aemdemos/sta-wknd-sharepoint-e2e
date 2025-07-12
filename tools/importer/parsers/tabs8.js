/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab labels
  const tabList = tabsRoot.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabelElements = Array.from(tabList.querySelectorAll('li[role="tab"]'));
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // Find all tab panels (they should be in order as labels)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]'));

  // Build the rows for the block table
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs8)']);
  // Tab label row (all in one row)
  rows.push(tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  }));
  // Each tab panel content in its own row as a single cell
  for (const panel of tabPanels) {
    // We want to keep the content as close as possible to the original
    // Usually the first article in the panel contains all tab content
    let contentNodes = [];
    const article = panel.querySelector('article');
    if (article) {
      // The actual content is in .cmp-contentfragment__elements inside article
      const cfEls = article.querySelector('.cmp-contentfragment__elements');
      if (cfEls) {
        // Gather all children of .cmp-contentfragment__elements except empty grid wrappers
        const elements = Array.from(cfEls.children).filter(child => {
          // Filter out <div> that only contain .aem-Grid wrappers
          if (child.children.length === 1 && child.children[0].classList.contains('aem-Grid')) {
            return false;
          }
          // Filter empty grid divs
          if (child.classList.contains('aem-Grid')) return false;
          return true;
        });
        // For each of these, pull out their childNodes (flatten)
        for (const el of elements) {
          // Some may be wrappers, others are actual content
          // If it only has one child and that child is a .aem-Grid, skip
          if (el.classList.contains('aem-Grid')) continue;
          // Unwrap if just a wrapper
          Array.from(el.childNodes).forEach(node => {
            // Don't include grid wrappers
            if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) return;
            contentNodes.push(node);
          });
        }
      }
      // Also get any other direct children of article that are not .cmp-contentfragment__elements (like h3)
      Array.from(article.children).forEach(child => {
        if (!child.classList.contains('cmp-contentfragment__elements')) {
          contentNodes.push(child);
        }
      });
    } else {
      // If no article, just use all panel children
      contentNodes = Array.from(panel.childNodes);
    }
    // Remove whitespace-only text nodes
    const filteredNodes = contentNodes.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // Place all the relevant nodes in the cell
    rows.push([filteredNodes]);
  }

  // Create the table and replace the original tabs element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
