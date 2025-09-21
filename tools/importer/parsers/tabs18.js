/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from tab panel
  function getTabLabelAndContent(tabEl, tabPanelEl) {
    // Tab label is the textContent of the <li> element
    let label = tabEl ? tabEl.textContent.trim() : '';
    // Tab content is the contentfragment/article inside the tabpanel
    let content = null;
    if (tabPanelEl) {
      // Defensive: find the main contentfragment/article
      const article = tabPanelEl.querySelector('article');
      if (article) {
        content = article;
      } else {
        // Fallback: use tabPanelEl itself
        content = tabPanelEl;
      }
    }
    return [label, content];
  }

  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels (li elements)
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get tab panels (divs with role="tabpanel")
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose rows: first row is header
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabEls.length; i++) {
    const tabEl = tabEls[i];
    // Find the tabpanel for this tab
    // The tabpanel's aria-labelledby matches the tab's id
    const tabId = tabEl.getAttribute('id');
    const tabPanelEl = tabPanelEls.find(
      (panel) => panel.getAttribute('aria-labelledby') === tabId
    );
    const [label, content] = getTabLabelAndContent(tabEl, tabPanelEl);
    // Defensive: if label or content missing, skip
    if (!label || !content) continue;
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
