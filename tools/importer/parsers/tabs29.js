/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get tab label and content from tab panel
  function extractTab(tabEl, tabPanelEl) {
    // Tab label from <li>
    const tabLabel = tabEl.textContent.trim();
    // Tab content: use the contentfragment/article inside tabPanelEl
    // Defensive: grab the first article/contentfragment inside
    let tabContent = null;
    const cf = tabPanelEl.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Use the inner contentfragment__elements if present, else the whole article
      const elements = cf.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        tabContent = elements;
      } else {
        tabContent = cf;
      }
    } else {
      // fallback: use the whole tabPanelEl
      tabContent = tabPanelEl;
    }
    return [tabLabel, tabContent];
  }

  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels and panels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  // Each tab panel is a div with role="tabpanel"
  const tabPanelEls = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));
  // Defensive: ensure same number of tabs and panels
  const tabRows = [];
  for (let i = 0; i < tabEls.length && i < tabPanelEls.length; i++) {
    tabRows.push(extractTab(tabEls[i], tabPanelEls[i]));
  }

  // Block header
  const headerRow = ['Tabs (tabs29)'];
  // Build table rows: each tab is [label, content]
  const tableRows = tabRows.map(([label, content]) => [label, content]);

  // Build table
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with table
  tabsBlock.replaceWith(block);
}
