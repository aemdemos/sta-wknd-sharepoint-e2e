/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = tabList.querySelectorAll('li[role="tab"]');
  if (!tabLabelEls.length) return;

  // Get all tab panels (each has a tabpanel role)
  const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');

  // Prepare block rows: header row first
  const rows = [];
  rows.push(['Tabs (tabs35)']); // Component/block name as header, exactly as requirement

  // For each tab, get the label, and tabpanel main content
  for (let i = 0; i < tabLabelEls.length; i++) {
    const tabLabelEl = tabLabelEls[i];
    const label = tabLabelEl.textContent.trim();
    // Find the corresponding panel by aria-controls, fallback by index
    let panel = null;
    const ariaControls = tabLabelEl.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabs.querySelector(`#${ariaControls}`);
    }
    if (!panel && tabPanels[i]) {
      panel = tabPanels[i];
    }
    if (!panel) continue; // safety

    // Find the main content inside the tabpanel
    // Usually inside an article, but fallback to the first content block
    let tabContent = null;
    // If there's an article, use it; else, try first child div; else, use the panel
    tabContent = panel.querySelector('article');
    if (!tabContent) {
      // Try the first .contentfragment or just the first content block
      tabContent = panel.querySelector('.contentfragment');
    }
    if (!tabContent) {
      // Fallback: look for the first element that isn't empty
      let children = Array.from(panel.children).filter(c => c.textContent.trim() || c.querySelector('img,ul,ol,table,h1,h2,h3,h4,h5,h6'));
      tabContent = children[0] || panel;
    }
    // Reference the actual DOM node (no cloning or innerHTML)
    rows.push([
      label,
      tabContent
    ]);
  }

  // Create the table and replace the tabs block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabs.replaceWith(table);
}
