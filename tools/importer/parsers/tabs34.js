/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tablist = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tablist) return;
  const tabLabels = Array.from(tablist.querySelectorAll('li[role="tab"]'));

  // Get all tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((tabLabel) => {
    // Defensive: Find the corresponding tabpanel
    const tabPanel = tabPanels.find(panel => {
      return panel.getAttribute('aria-labelledby') === tabLabel.id;
    });
    if (!tabPanel) return;

    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content: collect everything inside the tabpanel
    // Try to find the main content fragment inside the tabPanel
    let tabContent = [];
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use all direct children of .cmp-contentfragment__elements (if present)
      const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elementsContainer) {
        // Gather all direct children (including images, headings, paragraphs, lists)
        const directChildren = Array.from(elementsContainer.children).filter(child => {
          // Exclude empty grid wrappers
          if (child.classList.contains('aem-Grid')) return false;
          return true;
        });
        if (directChildren.length) {
          tabContent.push(...directChildren);
        } else {
          // If no direct children, fallback to all children
          tabContent.push(elementsContainer);
        }
      } else {
        // If no elements container, fallback to all children of contentFragment
        tabContent.push(contentFragment);
      }
    } else {
      // If no contentfragment, fallback to all children of tabPanel
      tabContent.push(...Array.from(tabPanel.children));
    }

    // Defensive: If tabContent is empty, fallback to tabPanel itself
    if (!tabContent.length) {
      tabContent.push(tabPanel);
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
