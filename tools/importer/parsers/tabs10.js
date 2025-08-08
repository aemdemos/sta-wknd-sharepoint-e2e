/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get tab panels, in correct order (should match order of tabLabels)
  const tabPanelEls = tabLabels.map(label => {
    // match by aria-labelledby if possible, fallback to order
    // aria-labelledby points to tab id
    const tabEl = tabLabelEls.find(el => el.textContent.trim() === label);
    if (tabEl && tabEl.id) {
      return tabs.querySelector(`[role="tabpanel"][aria-labelledby="${tabEl.id}"]`);
    }
    // fallback: order
    return tabs.querySelectorAll('[role="tabpanel"]')[tabLabels.indexOf(label)];
  });

  // Header row: block name as shown in the example
  const cells = [['Tabs (tabs10)']];

  // For each tab, get [label, content] as table row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    let content;
    if (panel) {
      // The desired content is the full .contentfragment inside the tab panel
      // If not present, use all children of the panel
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        content = cf;
      } else {
        // gather all child nodes (elements or non-empty text nodes)
        const arr = Array.from(panel.childNodes).filter(n => {
          if (n.nodeType === 1) return true;
          if (n.nodeType === 3) return n.textContent.trim().length > 0;
          return false;
        });
        if (arr.length === 1) {
          content = arr[0];
        } else if (arr.length > 1) {
          content = arr;
        } else {
          content = '';
        }
      }
    } else {
      content = '';
    }
    cells.push([label, content]);
  }

  // Use the helper to create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
