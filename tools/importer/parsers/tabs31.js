/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the cmp-tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Extract tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // 2. Extract tab panels (ordered as in tabLabels)
  const tabPanels = tabLabels.map((_, idx) => {
    // Tabs are in order, so get all tabpanel elements as they appear
    return tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')[idx];
  });

  // Prepare rows: header + one row per tab (2 columns: label, content)
  const rows = [['Tabs (tabs31)']];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) {
      // If panel missing, use empty cell
      rows.push([label, '']);
      continue;
    }
    // Try to find the main article > .cmp-contentfragment__elements if present
    const cfElements = panel.querySelector('article .cmp-contentfragment__elements');
    let tabContentNodes = [];
    if (cfElements) {
      // Gather all actual content nodes (skip empty grid wrappers)
      for (const child of cfElements.children) {
        // Ignore empty grid wrappers
        if (
          child.tagName === 'DIV' &&
          child.children.length === 1 &&
          child.firstElementChild &&
          child.firstElementChild.classList.contains('aem-Grid')) {
          continue; // skip grid-only wrapper
        }
        // If it's a div with aem-GridColumn, get its children if present
        if (child.tagName === 'DIV' && child.classList.contains('aem-GridColumn')) {
          tabContentNodes.push(...child.childNodes);
        } else {
          tabContentNodes.push(child);
        }
      }
      // If nothing found, fallback to cfElements childNodes
      if (tabContentNodes.length === 0) {
        tabContentNodes = Array.from(cfElements.childNodes);
      }
    } else {
      // Fallback: all panel's children
      tabContentNodes = Array.from(panel.childNodes);
    }
    // Remove empty/whitespace text nodes
    tabContentNodes = tabContentNodes.filter(node => {
      if (node.nodeType === 3) return !!node.textContent.trim();
      if (node.nodeType === 1) return !!node.textContent.trim() || node.querySelector('img,ul,ol,dl,table');
      return false;
    });
    // If nothing remains, fallback to the panel itself
    let tabContent;
    if (tabContentNodes.length === 0) {
      tabContent = panel;
    } else if (tabContentNodes.length === 1) {
      tabContent = tabContentNodes[0];
    } else {
      tabContent = tabContentNodes;
    }
    rows.push([label, tabContent]);
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
