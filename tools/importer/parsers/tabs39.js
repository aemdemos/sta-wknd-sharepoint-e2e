/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all tabpanel elements
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Build rows for the table
  const headerRow = ['Tabs (tabs39)'];
  const rows = [headerRow];

  // For each tab, get label and content
  tabLabels.forEach((tabLabel, i) => {
    // Defensive: Find the corresponding tabpanel by aria-controls
    const tabPanelId = tabLabel.getAttribute('aria-controls');
    const tabPanel = cmpTabs.querySelector(`#${tabPanelId}`);
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: grab the main contentfragment/article inside the tabpanel
    let tabContent;
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // For the Overview tab, include image and description
      if (labelText.toLowerCase() === 'overview') {
        // Try to find image and description paragraph
        const image = contentFragment.querySelector('.cmp-image img');
        const descParagraph = contentFragment.querySelector('p');
        // Compose content: image (if exists) + paragraph (if exists)
        const tabContentArr = [];
        if (image) tabContentArr.push(image);
        if (descParagraph) tabContentArr.push(descParagraph);
        tabContent = tabContentArr.length === 1 ? tabContentArr[0] : tabContentArr;
      } else {
        // For other tabs, include all content under .cmp-contentfragment__elements
        const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          tabContent = elements;
        } else {
          // Fallback: use the whole contentFragment
          tabContent = contentFragment;
        }
      }
    } else {
      // Fallback: use tabPanel inner content
      tabContent = tabPanel;
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
