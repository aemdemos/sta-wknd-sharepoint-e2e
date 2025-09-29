/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs, .tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (contains tablist and tabpanels)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;

  // Get tab labels from the tablist (ol > li)
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (content for each tab)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure tabLabels and tabPanels correspond
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    // Find the corresponding tabpanel (by order)
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Use the entire tabpanel content (preserves structure, images, etc.)
      // Remove aria-hidden tabs (not visible), but always include their content
      // Find the main contentfragment/article inside the panel
      const cf = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;
      // Defensive: if cf is the panel itself and has no children, fallback
      if (cf && cf !== panel && cf.children.length) {
        content = cf;
      } else {
        // fallback to panel's children
        content = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => content.appendChild(node.cloneNode(true)));
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
