/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element in the given element
  let tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels from tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  let tabLabels = [];
  if (tabList) {
    tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());
  }

  // Extract tab panels (order matters)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: each is [Label, Content]
  const rows = tabPanels.map((panel, i) => {
    // Label
    let label = tabLabels[i];
    if (!label) {
      // fallback: try aria-labelledby element
      const labelledBy = panel.getAttribute('aria-labelledby');
      if (labelledBy) {
        const labelElem = document.getElementById(labelledBy);
        label = labelElem ? labelElem.textContent.trim() : '';
      }
    }
    // Content: reference main contentfragment/article in panel (if any), else use panel itself
    let tabContent = null;
    const cf = panel.querySelector('.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback to panel
      tabContent = panel;
    }
    return [label, tabContent];
  });

  // Table header matches example
  const headerRow = ['Tabs (tabs23)'];
  // Table data: block name header row, then each tab row
  const cells = [headerRow, ...rows];

  // Create the block table using referenced elements
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs element with the new block table
  tabs.parentNode.replaceChild(block, tabs);
}
