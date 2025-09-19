/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) {
    // Defensive: fallback to only panels that match labels
    const minLen = Math.min(tabLabels.length, tabPanels.length);
    tabLabels.length = minLen;
    tabPanels.length = minLen;
  }

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // Each tab: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;

    // Defensive: If panel is missing, skip
    if (!panel) continue;

    // For each panel, extract the main contentfragment/article (if present)
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
    if (contentFragment) {
      // For the first tab (Overview), try to include the image and description together
      if (i === 0) {
        // Find image (if any)
        const imgDiv = contentFragment.querySelector('.cmp-image');
        const img = imgDiv ? imgDiv.querySelector('img') : null;
        // Find image caption (if any)
        const caption = imgDiv ? imgDiv.querySelector('.cmp-image__title') : null;
        // Find description paragraph
        let desc = null;
        // Try to find a <p> inside the contentfragment
        desc = contentFragment.querySelector('p');
        // Compose content cell
        const cellContent = [];
        if (img) cellContent.push(img);
        if (caption) cellContent.push(caption);
        if (desc) cellContent.push(desc);
        content = cellContent.length ? cellContent : contentFragment;
      } else {
        // For other tabs, try to find main content (paragraph or list)
        let mainContent = contentFragment.querySelector('p, ul, ol');
        content = mainContent ? mainContent : contentFragment;
      }
    } else {
      // Fallback: use panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original tabs block with new table
  tabsBlock.replaceWith(block);
}
