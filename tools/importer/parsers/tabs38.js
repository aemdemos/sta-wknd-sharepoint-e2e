/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs inside the tabs container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (order matches tabLabels)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose the table rows
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Defensive: use the entire tabpanel content
      // Remove aria-hidden panels from the DOM if present (shouldn't matter, but for safety)
      // We'll extract the first child (usually a .contentfragment)
      let panelContent = [];
      // Only include visible content (not aria-hidden)
      if (!panel.hasAttribute('aria-hidden') || panel.getAttribute('aria-hidden') !== 'true') {
        // If the panel has a .contentfragment, use its children
        const cf = panel.querySelector('.contentfragment');
        if (cf) {
          // Remove empty grid wrappers
          // We'll collect all non-empty direct children of .cmp-contentfragment__elements
          const elements = cf.querySelector('.cmp-contentfragment__elements');
          if (elements) {
            // Flatten out nested wrappers, but keep meaningful content
            // We'll collect all direct children that are not empty grid wrappers
            Array.from(elements.children).forEach(child => {
              // If child contains only empty grid wrappers, skip
              if (
                child.children.length === 1 &&
                child.firstElementChild &&
                child.firstElementChild.classList.contains('aem-Grid') &&
                child.firstElementChild.children.length === 0
              ) {
                return;
              }
              // Otherwise, include
              panelContent.push(child);
            });
          } else {
            // Fallback: use the whole .contentfragment
            panelContent.push(cf);
          }
        } else {
          // Fallback: use the whole panel
          panelContent.push(panel);
        }
      } else {
        // Panel is hidden, but we still want to extract its content
        const cf = panel.querySelector('.contentfragment');
        if (cf) {
          const elements = cf.querySelector('.cmp-contentfragment__elements');
          if (elements) {
            Array.from(elements.children).forEach(child => {
              if (
                child.children.length === 1 &&
                child.firstElementChild &&
                child.firstElementChild.classList.contains('aem-Grid') &&
                child.firstElementChild.children.length === 0
              ) {
                return;
              }
              panelContent.push(child);
            });
          } else {
            panelContent.push(cf);
          }
        } else {
          panelContent.push(panel);
        }
      }
      // If panelContent is empty, fallback to panel
      if (panelContent.length === 0) {
        panelContent = [panel];
      }
      content = panelContent;
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabsContainer with the table
  tabsContainer.replaceWith(table);
}
