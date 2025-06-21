/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li's in the tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []);

  // Get all tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure tabLabels.length === tabPanels.length
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Prepare the header row
  const headerRow = ['Tabs (tabs13)'];
  // Prepare the rows: header, then one for each tab (label and content)
  const rows = [headerRow];

  for (let i = 0; i < tabCount; i++) {
    const tabLabel = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // For the content: find the .cmp-contentfragment inside the panel, else use panel's content
    let content = null;
    const fragment = panel.querySelector('.cmp-contentfragment');
    if (fragment) {
      content = fragment;
    } else {
      // If no contentfragment, but there is a .contentfragment wrapper, use that
      const wrapper = panel.querySelector('.contentfragment');
      if (wrapper) {
        content = wrapper;
      } else {
        // Otherwise, use the entire tabpanel's content
        content = panel;
      }
    }
    rows.push([tabLabel, content]);
  }

  // Build the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the .cmp-tabs element with our newly created block
  tabsBlock.replaceWith(block);
}
