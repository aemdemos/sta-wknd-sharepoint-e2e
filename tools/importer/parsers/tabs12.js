/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block in the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels and associated tabpanel IDs in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  const tabIds = [];
  tabList && tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
    tabLabels.push(tab.textContent.trim());
    tabIds.push(tab.getAttribute('aria-controls'));
  });

  // Prepare the rows for the table block
  const rows = [['Tabs (tabs12)']]; // Header row, exactly as specified

  // For each tab, extract its content and add a row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabpanelId = tabIds[i];
    let content = '';
    if (tabpanelId) {
      const panel = tabsBlock.querySelector(`#${tabpanelId}`);
      if (panel) {
        // Reference the main content node for semantic meaning
        // If there's an article/contentfragment, use it; otherwise, use panel's content
        const contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment');
        if (contentFragment) {
          content = contentFragment;
        } else {
          // fallback: include all content of the panel
          content = Array.from(panel.childNodes).filter(node => {
            // skip whitespace-only text nodes
            return !(node.nodeType === 3 && !node.textContent.trim());
          });
        }
      } else {
        content = document.createTextNode('');
      }
    } else {
      content = document.createTextNode('');
    }
    rows.push([label, content]);
  }

  // Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(table);
}
