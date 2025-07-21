/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels and panels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Compose rows for the tabs table
  const rows = [["Tabs (tabs19)"]];
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      tabContent = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('aem-Grid')) {
          return node.querySelector('*');
        }
        return true;
      });
      if (tabContent.length === 1) {
        tabContent = tabContent[0];
      } else if (tabContent.length === 0) {
        tabContent = '';
      }
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Fix the header row to span both columns if needed
  if (table.rows.length > 1 && table.rows[1].cells.length > 1) {
    const th = table.rows[0].cells[0];
    th.setAttribute('colspan', table.rows[1].cells.length);
  }

  tabsRoot.replaceWith(table);
}
