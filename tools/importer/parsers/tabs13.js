/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container by class
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Find all tab labels (li elements in the tablist)
  const tablist = tabsContainer.querySelector('[role="tablist"]');
  const tabLabels = Array.from(tablist ? tablist.children : []);
  
  // Find all tab panels (each contains content for a tab)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[role="tabpanel"]'));
  
  // Compose header row (block name per spec)
  const headerRow = ['Tabs (tabs13)'];
  
  // Compose each tab row: [label, content]
  const rows = tabLabels.map((labelEl, i) => {
    let tabLabelText = labelEl.textContent.trim();

    // Find the corresponding tab panel by aria-controls or index fallback
    let tabPanel = null;
    const ariaControls = labelEl.getAttribute('aria-controls');
    if (ariaControls) {
      tabPanel = tabsContainer.querySelector(`#${ariaControls}`);
    }
    if (!tabPanel) {
      tabPanel = tabPanels[i];
    }
    if (!tabPanel) return [tabLabelText, ''];

    // Prefer the .cmp-contentfragment child as content
    const contentFragment = tabPanel.querySelector('.cmp-contentfragment');
    let tabContent = contentFragment ? contentFragment : tabPanel;

    // Remove tabPanel's id/aria attributes for cleanliness if referencing tabPanel
    // but only reference existing DOM nodes (do not clone/copy)
    return [tabLabelText, tabContent];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs container with block table
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
