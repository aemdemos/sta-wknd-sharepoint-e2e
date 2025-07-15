/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (the main cmp-tabs container)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels in order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get all tabpanel elements in order
  const tabPanelEls = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Structure first row as block header
  const cells = [
    ['Tabs (tabs7)']
  ];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // Defensive: if there's no panel for a label, skip
    if (!panel) continue;

    // Find the main content for the tab (prefer the <article> in tab panel if exists, otherwise use all children)
    let tabContent;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      // fallback: gather all direct children (excluding empty and script/style/meta)
      const fragment = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === 1 && !['SCRIPT', 'STYLE', 'META'].includes(node.nodeName) && node.textContent.trim() !== '') {
          fragment.appendChild(node);
        }
      });
      // If fragment has only one node, use that, else the fragment
      if (fragment.childNodes.length === 1) {
        tabContent = fragment.firstChild;
      } else {
        tabContent = fragment;
      }
    }
    cells.push([label, tabContent]);
  }

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
