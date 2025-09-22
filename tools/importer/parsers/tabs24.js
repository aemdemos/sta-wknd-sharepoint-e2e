/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Block header row per spec
  const headerRow = ['Tabs (tabs24)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content fragment/article in each panel
    const article = panel.querySelector('article');
    let tabContent;
    if (article) {
      tabContent = article;
    } else {
      // fallback: use all children (rare)
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        tabContent.appendChild(node);
      });
    }
    rows.push([label, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
