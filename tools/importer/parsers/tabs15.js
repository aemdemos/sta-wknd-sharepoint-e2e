/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the .tabs block, which contains the tab headers and contents
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Extract tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row exactly as required
  const headerRow = ['Tabs (tabs15)'];

  // Each tab label and its content as a row
  const rows = tabLabels.map((tab) => {
    // Tab label text
    const labelText = tab.textContent.trim();
    // Find matching panel for this tab -- via aria-labelledby
    const panel = tabPanels.find(
      p => p.getAttribute('aria-labelledby') === tab.id
    );
    // The content should reference the top-level contentfragment, or fallback to panel itself
    let content = '';
    if (panel) {
      const cf = panel.querySelector('.cmp-contentfragment');
      content = cf ? cf : panel;
    }
    return [labelText, content];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with our block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
