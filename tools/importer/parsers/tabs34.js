/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li.cmp-tabs__tab'));

  // Find all tabpanel containers
  const panels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build a map from tab id to panel element for quick access
  const panelMap = {};
  panels.forEach((panel) => {
    const tabId = panel.getAttribute('aria-labelledby');
    if (tabId) {
      panelMap[tabId] = panel;
    }
  });

  // Build the header row for the block table
  const headerRow = ['Tabs (tabs34)'];

  // For each tab, extract the label and content panel
  const rows = tabItems.map((tab) => {
    // Tab label
    const label = tab.textContent.trim();
    const tabId = tab.getAttribute('id');
    // Find the corresponding panel
    const panel = panelMap[tabId];
    let tabContent = '';
    if (panel) {
      // Find the first .contentfragment (which holds all tab content)
      // This is the most robust as all content is inside it, including headings, images, lists, etc.
      const contentFragment = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // If not present, use all children (not the panel itself, avoiding conversion to string)
        // Filter out empty content and structural grid divs
        tabContent = Array.from(panel.childNodes).filter((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) return false;
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return false;
          return true;
        });
        // If only one child, use the node directly
        if (tabContent.length === 1) tabContent = tabContent[0];
      }
    }
    return [label, tabContent];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the tabs element with the new block table
  tabs.replaceWith(table);
}
