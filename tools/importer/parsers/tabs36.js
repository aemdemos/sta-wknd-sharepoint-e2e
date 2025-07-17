/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root: look for a .cmp-tabs element within 'element'
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist (order matters)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLis = Array.from(tabList.querySelectorAll('li'));
  const tabLabels = tabLis.map(li => li.textContent.trim());

  // Get all tab panels in the order they appear
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the table header row
  const headerRow = ['Tabs (tabs36)'];
  const blockRows = [headerRow];

  // Process each tab: label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentEl = null;
    if (panel) {
      // The tab panel's meaningful content (usually an article/contentfragment inside)
      // We'll keep all ELEMENT children (ignoring blank text nodes or comment nodes)
      const children = Array.from(panel.childNodes).filter(n => n.nodeType === 1 && (n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE'));
      if (children.length === 1) {
        contentEl = children[0];
      } else if (children.length > 1) {
        // Wrap multiple nodes in a <div>
        const wrapper = document.createElement('div');
        children.forEach(child => wrapper.appendChild(child));
        contentEl = wrapper;
      } else {
        // fallback: use the panel itself, but only if it contains useful content
        contentEl = panel;
      }
    } else {
      contentEl = document.createTextNode('');
    }
    blockRows.push([label, contentEl]);
  }

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(blockRows, document);

  // Replace the .cmp-tabs DOM element with the table block
  tabs.replaceWith(block);
}
