/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in descendants
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;
  
  // Get tab labels in order
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('[role="tab"]')).map(li => li.textContent.trim());
  
  // Get tab panels in order
  const tabPanels = tabLabels.map(label => {
    // Each tab has aria-controls to its panel
    const tabLi = Array.from(tablist.querySelectorAll('[role="tab"]')).find(li => li.textContent.trim() === label);
    if (!tabLi) return null;
    const panelId = tabLi.getAttribute('aria-controls');
    if (!panelId) return null;
    return tabs.querySelector(`#${panelId}`);
  });
  
  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs8)']);

  // For each tab, extract its label and all its meaningful content in a cell
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;
    // The tab's content is everything inside the corresponding tabpanel
    // We want to reference the contentfragment/article inside the tabpanel for resilience
    const cfArticle = panel.querySelector('article');
    let tabContent;
    if (cfArticle) {
      tabContent = cfArticle;
    } else {
      // fallback: reference everything in the tabpanel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
          tabContent.appendChild(node);
        }
      });
    }
    rows.push([label, tabContent]);
  });

  // Create tabs block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
