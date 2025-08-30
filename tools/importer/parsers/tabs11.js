/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // --- Extract tab labels ---
  const tabLabelEls = tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]');
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // --- Extract tab panels ---
  // Gather all tab panels in order
  const tabPanelEls = tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');

  // --- Build header row (use block name exactly as required) ---
  const headerRow = ['Tabs (tabs11)'];

  // --- Build tab rows, each with: tab label, tab content (reference existing block) ---
  const tabRows = tabLabels.map((label, idx) => {
    // Defensive: fallback in case of mismatch
    const panelEl = tabPanelEls[idx];
    let tabContent = null;
    if (panelEl) {
      // Prefer to reference the contentfragment/article as a whole, if present
      const contentFragment = panelEl.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Otherwise, reference the panel itself (which contains the content)
        tabContent = panelEl;
      }
    } else {
      // If no panel, create an empty div as placeholder
      tabContent = document.createElement('div');
    }
    return [label, tabContent];
  });

  // --- Compose the table ---
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- Replace the tabs block with the table ---
  tabsBlock.replaceWith(block);
}
