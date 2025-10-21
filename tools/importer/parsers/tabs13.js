/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels (li elements in tablist)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs13)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    
    // Tab panel content
    const tabPanel = tabPanels[i];
    // Defensive: skip if missing
    if (!tabPanel) return;

    // Extract the main content fragment/article inside the tab panel
    let tabContent = null;
    const cf = tabPanel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use the article as the content block
      tabContent = cf.cloneNode(true);
    } else {
      // Fallback: use all children of the tabPanel
      tabContent = document.createElement('div');
      Array.from(tabPanel.childNodes).forEach((node) => {
        tabContent.appendChild(node.cloneNode(true));
      });
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
