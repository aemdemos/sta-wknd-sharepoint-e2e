/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (by .tabs or .panelcontainer)
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .tabs');
  if (!tabsContainer) return;

  // Find the CMP tabs element inside
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the <ol> list
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  tabList && tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
  });
  if (!tabLabels.length) return;

  // Get tab panels (content)
  // Only include panels that match the number of labels
  const tabPanelNodes = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  ).slice(0, tabLabels.length);
  if (!tabPanelNodes.length) return;

  // Compose rows, first row is header (must have two columns: [header, ''])
  const headerRow = ['Tabs (tabs37)', ''];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelNodes[i];
    // The content we want for the tab is the entire tabpanel node's content
    // Reference existing elements instead of cloning
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      tabContent = article;
    } else {
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Use the panel itself as the fallback
        tabContent = panel;
      }
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the block table
  tabsContainer.replaceWith(blockTable);
}
