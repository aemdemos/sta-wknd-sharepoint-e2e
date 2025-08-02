/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the header row (block name in a single cell, as per example)
  const headerRow = ['Tabs (tabs8)'];

  // Build each tab row: [tab label, tab content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentCell = '';
    if (panel) {
      // Find main contentfragment in panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
        contentCell = elements ? elements : contentFragment;
      } else {
        // Fallback: use all children of the panel
        if (panel.childNodes.length === 1) {
          contentCell = panel.firstChild;
        } else {
          const frag = document.createDocumentFragment();
          Array.from(panel.childNodes).forEach(n => frag.appendChild(n));
          contentCell = frag;
        }
      }
    }
    rows.push([label, contentCell]);
  }

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
