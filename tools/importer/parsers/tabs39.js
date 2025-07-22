/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and tab panels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]')).filter(
    panel => panel.closest('.cmp-tabs') === cmpTabs
  );
  const nTabs = Math.min(tabLabels.length, tabPanels.length);
  if (nTabs === 0) return;

  // Build the correct table structure: header row, then one row per tab (label, content)
  const cells = [[ 'Tabs (tabs39)' ]]; // header row
  for (let i = 0; i < nTabs; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Include all children except script/style, and non-empty text nodes
    const tabContent = [];
    Array.from(panel.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!['SCRIPT', 'STYLE'].includes(node.tagName)) {
          tabContent.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        tabContent.push(node);
      }
    });
    cells.push([label, tabContent.length > 0 ? tabContent : '']);
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsWrapper.replaceWith(table);
}
