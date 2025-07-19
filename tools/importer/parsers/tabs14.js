/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get the tab labels and their order
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Map of tab id -> panel
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabIdToPanel = {};
  tabPanels.forEach(panel => {
    const labelledBy = panel.getAttribute('aria-labelledby');
    if (labelledBy) tabIdToPanel[labelledBy] = panel;
  });

  // Header row
  const headerRow = ['Tabs (tabs14)'];
  const rows = [];

  // For each tab, build a row [label, content]
  tabLabels.forEach(labelEl => {
    const labelText = labelEl.textContent.trim();
    // Prefer to get the right tab panel using aria-labelledby
    let tabPanel = tabIdToPanel[labelEl.id];
    // As fallback, use index order if not mapped
    if (!tabPanel) {
      tabPanel = tabPanels[tabLabels.indexOf(labelEl)];
    }
    let tabContent;
    if (tabPanel) {
      // Find the main content for the tab. Usually it's a direct child div or an article
      // Prefer the .contentfragment or the first element child
      const contentFragment = tabPanel.querySelector('.contentfragment, article.cmp-contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // Use all top-level element children as content
        const nodeEls = Array.from(tabPanel.childNodes).filter(n => n.nodeType === 1);
        if (nodeEls.length === 1) {
          tabContent = nodeEls[0];
        } else if (nodeEls.length > 1) {
          tabContent = nodeEls;
        } else {
          // fallback: create empty div
          tabContent = document.createElement('div');
        }
      }
    } else {
      // No panel found for this tab, create empty div
      tabContent = document.createElement('div');
    }
    rows.push([labelText, tabContent]);
  });

  // Compose the table: header, then all tab rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original cmp-tabs element with the new table
  tabsContainer.replaceWith(table);
}
