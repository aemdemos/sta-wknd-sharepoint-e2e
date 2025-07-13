/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (ol.cmp-tabs__tablist > li)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabItems = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Each tabpanel contains the tab content. They are divs with role="tabpanel" and data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If counts mismatch, fallback to minimum count for pairing
  const tabCount = Math.min(tabItems.length, tabPanels.length);
  if (tabCount === 0) return;

  // Prepare header row exactly as required
  const headerRow = ['Tabs (tabs3)'];

  // Prepare content rows: each row is [Tab Label, Tab Content Element(s)]
  const rows = [];
  for (let i = 0; i < tabCount; i++) {
    // Tab label text
    const label = tabItems[i].textContent.trim();
    // Tab panel content: Use the .contentfragment inside each tabpanel if possible, otherwise whole tabpanel
    let tabContent;
    const contentFragment = tabPanels[i].querySelector('.contentfragment');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // fallback: everything inside the tabpanel, as an array of elements
      tabContent = Array.from(tabPanels[i].childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    }
    rows.push([label, tabContent]);
  }

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
