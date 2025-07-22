/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tablist) {
    tablist.querySelectorAll('[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get tab panels in order (they appear in order in the DOM)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows for table: header, then each tab label + content
  const rows = [];
  rows.push(['Tabs (tabs31)']);
  for(let i=0; i<tabLabels.length; i++){
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Compose tab content: Reference the main content fragment/article if present, else the panel
    let contentElement = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      contentElement = contentFragment;
    } else {
      // fallback to everything within the tabpanel (children as array)
      // If there are no child nodes, fallback to the panel itself
      const children = Array.from(panel.childNodes).filter(node => {
        // Filter out empty text nodes
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (children.length === 1) {
        contentElement = children[0];
      } else if (children.length > 1) {
        contentElement = children;
      } else {
        contentElement = panel;
      }
    }
    rows.push([label, contentElement]);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
