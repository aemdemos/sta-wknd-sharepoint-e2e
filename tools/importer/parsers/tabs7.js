/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Prepare the rows for the table block
  const rows = [['Tabs (tabs7)']];

  tabLabels.forEach((tabLabel, idx) => {
    const labelText = tabLabel.textContent.trim();
    let panel = tabPanels[idx];
    if (!panel && tabLabel.hasAttribute('aria-controls')) {
      panel = tabsBlock.querySelector(`#${tabLabel.getAttribute('aria-controls')}`);
    }

    let tabContent = '';
    if (panel) {
      // Find the .cmp-contentfragment within the tab panel
      const fragment = panel.querySelector('article.cmp-contentfragment');
      if (fragment) {
        // Remove title if present (to avoid duplicate tab label in content)
        const title = fragment.querySelector('.cmp-contentfragment__title');
        if (title) title.remove();
        // Remove empty grid wrappers
        fragment.querySelectorAll('.aem-Grid').forEach(div => {
          if (!div.textContent.trim() && div.children.length === 0) div.remove();
        });
        // Create a container div and move all child nodes into it
        const contentDiv = document.createElement('div');
        while (fragment.childNodes.length) {
          contentDiv.appendChild(fragment.childNodes[0]);
        }
        // Merge consecutive empty divs
        Array.from(contentDiv.querySelectorAll('div')).forEach(d => {
          if (!d.textContent.trim() && d.children.length === 0) d.remove();
        });
        tabContent = contentDiv.childNodes.length === 1 ? contentDiv.firstChild : contentDiv;
      } else {
        // fallback: collect all content from the panel
        const contentDiv = document.createElement('div');
        Array.from(panel.childNodes).forEach(child => {
          contentDiv.appendChild(child);
        });
        tabContent = contentDiv.childNodes.length === 1 ? contentDiv.firstChild : contentDiv;
      }
    }
    rows.push([labelText, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
