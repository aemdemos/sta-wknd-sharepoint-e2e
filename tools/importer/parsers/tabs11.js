/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root (the one with class cmp-tabs)
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabEls = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panel contents
  // .cmp-tabs__tabpanel elements, order should match tabEls
  const panelEls = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare table rows
  const rows = [];
  // Header row, must match example exactly
  rows.push(['Tabs (tabs11)']);

  // For each tab, add row: [tab label, tab content]
  for (let i = 0; i < tabEls.length; i++) {
    const tabLabel = tabEls[i].textContent.trim();
    let tabContent = null;
    if (panelEls[i]) {
      // Reference all direct children of the tab panel in an array for robustness
      const tabPanel = panelEls[i];
      // Only include ELEMENT_NODE children (to avoid stray whitespace)
      const contentNodes = Array.from(tabPanel.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE);
      if (contentNodes.length === 1) {
        // If there is a single main content element, reference it directly
        tabContent = contentNodes[0];
      } else if (contentNodes.length > 1) {
        tabContent = contentNodes;
      } else {
        // fallback: include all (including text), but as a div for safety
        const holder = document.createElement('div');
        tabPanel.childNodes.forEach(n => holder.appendChild(n));
        tabContent = holder;
      }
    } else {
      // If no panel, just an empty div
      tabContent = document.createElement('div');
    }
    rows.push([tabLabel, tabContent]);
  }

  // Create table and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
