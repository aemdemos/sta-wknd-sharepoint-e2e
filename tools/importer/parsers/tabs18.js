/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsEl = tabsContainer;
  if (!tabsEl || !tabsEl.classList.contains('cmp-tabs')) {
    tabsEl = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!tabsEl) return;

  // Get tab labels (from the tablist)
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get tab panels (content)
  const tabPanels = Array.from(tabsEl.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: skip if not found
    if (!panel) return;

    // For robustness, grab the direct contentfragment/article inside each tabpanel
    // If not found, use the panel itself
    let tabContent = null;
    const cf = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
