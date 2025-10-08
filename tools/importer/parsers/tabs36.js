/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab navigation (tab titles)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabTitles = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if we have the same number of tabs and panels
  if (tabTitles.length !== tabPanels.length) return;

  // Table header
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract the label and its content
  tabTitles.forEach((tabTitle, idx) => {
    const label = tabTitle.textContent.trim();
    const panel = tabPanels[idx];

    // For tab content, grab the direct contentfragment/article inside the panel
    let tabContent = null;
    // Find the main contentfragment/article for the tab
    const cf = panel.querySelector('.contentfragment article');
    if (cf) {
      // For resilience, use the article element directly
      tabContent = cf;
    } else {
      // Fallback: Use all children of the panel
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
