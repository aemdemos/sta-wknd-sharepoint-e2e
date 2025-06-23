/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(li => li.textContent.trim()).filter(Boolean);

  // Get all tab panels in visual order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build rows - header row is single column, tab rows are two columns
  const rows = [];
  rows.push(['Tabs (tabs30)']); // Header row: single column

  // For each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Try to find the contentfragment as the tab content
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent = null;
    if (contentFragment) {
      // Get the cmp-contentfragment__elements, which contains meaningful content
      const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Exclude empty grid wrappers inside cfElements
        let toInclude = [];
        for (const node of cfElements.childNodes) {
          // Remove empty .aem-Grid wrappers
          if (node.nodeType === 1 && node.classList && node.classList.contains('aem-Grid')) {
            if (node.textContent.trim().length > 0) toInclude.push(node);
          } else if (node.nodeType === 3 && node.textContent.trim() === '') {
            // skip whitespace text nodes
            continue;
          } else {
            toInclude.push(node);
          }
        }
        // Also flatten if some nodes are wrappers
        if (toInclude.length === 1 && toInclude[0].nodeType === 1 && toInclude[0].tagName === 'DIV') {
          // Use children of that div
          tabContent = Array.from(toInclude[0].childNodes).filter(
            n => !(n.nodeType === 3 && n.textContent.trim() === '')
          );
        } else {
          tabContent = toInclude;
        }
        // fallback
        if (!tabContent || tabContent.length === 0) tabContent = [cfElements];
      } else {
        tabContent = [contentFragment];
      }
    } else {
      tabContent = [panel];
    }
    // If only one node, don't wrap as array
    let cellContent = (Array.isArray(tabContent) && tabContent.length === 1)
      ? tabContent[0]
      : tabContent;
    // Push as two columns: [label, content]
    rows.push([label, cellContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
