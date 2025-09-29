/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels
  const tabLabels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only continue if we have matching number of tabs and panels
  if (tabLabels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build the table rows
  const rows = [];
  // Header row as specified
  rows.push(['Tabs (tabs12)']);

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: skip if missing
    if (!label || !panel) continue;

    // For tab content, we want the visible content inside the tabpanel
    // Usually a .contentfragment or .cmp-contentfragment inside the panel
    // We'll grab the first child that is not a script/style/meta
    let tabContent = null;
    // Try to find the main content fragment/article
    tabContent = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment') || panel;

    // If the tabContent is the panel itself, we want to avoid including the panel container
    // Instead, create a fragment with all children
    let contentNode;
    if (tabContent === panel) {
      // Create a DocumentFragment to hold all child nodes
      contentNode = document.createDocumentFragment();
      Array.from(panel.childNodes).forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE) {
          contentNode.appendChild(n.cloneNode(true));
        }
      });
    } else {
      contentNode = tabContent;
    }
    rows.push([label, contentNode]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(block);
}
