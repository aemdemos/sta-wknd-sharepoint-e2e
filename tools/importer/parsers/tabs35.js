/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get all tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find all tabpanel elements (role="tabpanel")
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose the header row exactly as required
  const headerRow = ['Tabs (tabs35)'];

  // Compose the tab rows
  const rows = tabLabels.map((label, idx) => {
    // Tab label text
    const tabTitle = label.textContent.trim();
    // Tab panel corresponding to this tab
    const panel = tabPanels[idx];
    let contentElem = null;
    if (panel) {
      // Reference child contentfragment/article if it exists
      const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      if (contentFragment) {
        contentElem = contentFragment;
      } else {
        // If no contentfragment, use panel itself
        contentElem = panel;
      }
    } else {
      // If no panel, cell is empty
      contentElem = '';
    }
    return [tabTitle, contentElem];
  });

  // Final cells array for the block
  const cells = [headerRow, ...rows];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block in the source HTML
  tabsBlock.replaceWith(table);
}
