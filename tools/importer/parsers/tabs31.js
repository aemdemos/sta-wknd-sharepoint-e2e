/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Defensive: Some tabs may not have a corresponding panel
    const panelEl = tabPanels[i];
    if (!panelEl) return;

    // Tab label (text)
    const tabLabel = labelEl.textContent.trim();

    // Tab content: reference the whole tabpanel content
    // Defensive: Find the main contentfragment/article inside panel
    let tabContent = null;
    const contentFragment = panelEl.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: use panelEl itself
      tabContent = panelEl;
    }

    rows.push([tabLabel, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the block table
  tabs.replaceWith(block);
}
