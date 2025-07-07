/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Find the tab labels (li elements with role=tab)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Find the tabpanels (divs with [role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Prepare the rows for the block table; first row is the header
  const rows = [['Tabs (tabs3)']];

  // Loop through the tab labels and tab panels by matching aria-labelledby/tab.id
  tabLabels.forEach((tab) => {
    const label = tab.textContent.trim();
    // Find the panel with aria-labelledby === tab.id
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tab.id);
    if (!panel) return;

    // Try to find main content for this panel
    // Prefer any <article> within the panel (AEM content fragment), else use panel's children
    let content;
    const article = panel.querySelector('article');
    if (article) {
      content = article;
    } else {
      // Fallback: create an array of all non-empty child nodes of the panel
      const children = Array.from(panel.childNodes).filter(n => {
        // Filter out empty text nodes and script/style
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        if (n.nodeType === 1 && ['SCRIPT','STYLE'].includes(n.nodeName)) return false;
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0);
      });
      if (children.length === 1) {
        content = children[0];
      } else {
        content = children;
      }
    }

    rows.push([label, content]);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // Replace the .cmp-tabs element with the new table
  tabs.replaceWith(table);
}
