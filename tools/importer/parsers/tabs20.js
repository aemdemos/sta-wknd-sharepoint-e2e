/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: if not found, try to find by cmp-tabs class
  let cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs && tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  }
  if (!cmpTabs) return;

  // Get tab labels (li elements in tablist)
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Build rows: header first
  const rows = [
    ['Tabs (tabs20)']
  ];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const tabLabel = labelEl.textContent.trim();
    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: if panel missing, skip
    if (!panel) return;
    // For resilience, reference the whole panel content
    // Find the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: use panel itself
      tabContent = panel;
    }
    rows.push([
      tabLabel,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
