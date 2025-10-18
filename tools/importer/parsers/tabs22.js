/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the tab navigation (tab headers)
  const tabsNav = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabsNav) return;
  const tabHeaders = Array.from(tabsNav.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure headers and panels match
  if (tabHeaders.length !== tabPanels.length || tabHeaders.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const tabLabel = tabHeaders[i].textContent.trim();
    const tabPanel = tabPanels[i];

    // Defensive: If tabPanel is missing, skip
    if (!tabPanel) continue;

    // Extract all direct children of tabPanel's content fragment (if present)
    let tabContent;
    const contentFragment = tabPanel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Use the content fragment's children except the title
      const children = Array.from(contentFragment.children).filter(child => {
        // Exclude the title element (h3)
        return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
      });
      // If there's only one child and it's a wrapper, use its children
      if (children.length === 1 && children[0].classList.contains('cmp-contentfragment__elements')) {
        // Flatten all children of cmp-contentfragment__elements
        tabContent = Array.from(children[0].children);
      } else {
        tabContent = children;
      }
    } else {
      // Fallback: use all children of tabPanel
      tabContent = Array.from(tabPanel.children);
    }

    // Defensive: If no content, use empty string
    if (!tabContent || tabContent.length === 0) {
      tabContent = [''];
    }

    rows.push([tabLabel, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabsContainer with the block
  tabsContainer.replaceWith(block);
}
