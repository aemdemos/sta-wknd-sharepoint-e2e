/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table cells: first row is header, then each tab: [tab label, tab content]
  const cells = [['Tabs (tabs36)']];

  tabPanels.forEach((panel, i) => {
    // Tab label in first cell
    let label = '';
    if (tabLabels[i]) {
      label = tabLabels[i].textContent.trim();
    } else {
      const labelId = panel.getAttribute('aria-labelledby');
      if (labelId) {
        const labelEl = document.getElementById(labelId);
        if (labelEl) label = labelEl.textContent.trim();
      }
      if (!label) {
        try {
          const panelDataLayer = panel.getAttribute('data-cmp-data-layer');
          if (panelDataLayer) {
            const obj = JSON.parse(panelDataLayer.replace(/&quot;/g, '"'));
            for (const k in obj) {
              if (obj[k].dc && obj[k].dc.title) {
                label = obj[k].dc.title;
                break;
              }
            }
          }
        } catch(e) {}
      }
    }
    // Tab content in second cell
    const contentEls = Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim());
    cells.push([label, contentEls]);
  });

  // Create table and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
