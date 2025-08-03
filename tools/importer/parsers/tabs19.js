/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element (the tabs block)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (!tabLabels.length) return;

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // Compose the table header (ONLY the block name, as per the example)
  const rows = [['Tabs (tabs19)']];

  // Compose a row for each tab: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i].textContent.trim();
    const tabPanel = tabPanels[i];
    if (!tabLabel || !tabPanel) continue;

    let tabContentElement = null;
    // Get the first <article.cmp-contentfragment> in this panel (all content is wrapped in it)
    const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Reference the article directly as its contents are the tab content (including images, headings, lists, etc)
      tabContentElement = contentFragment;
    } else {
      // fallback: use the entire tabPanel's children except for empty nodes
      const nodes = Array.from(tabPanel.childNodes).filter(n => {
        if (n.nodeType === 3 && !n.textContent.trim()) return false; // skip empty text
        if (n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) return false;
        return true;
      });
      if (nodes.length === 1) {
        tabContentElement = nodes[0];
      } else if (nodes.length > 1) {
        tabContentElement = nodes;
      } else {
        tabContentElement = document.createElement('div'); // empty
      }
    }

    rows.push([
      tabLabel,
      tabContentElement,
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the parent .tabs container with the block table
  const tabsContainer = tabsBlock.closest('.tabs');
  if (tabsContainer) {
    tabsContainer.replaceWith(block);
  } else {
    tabsBlock.replaceWith(block);
  }
}
