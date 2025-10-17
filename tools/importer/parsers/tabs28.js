/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (!cmpTabs || !cmpTabs.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : []);

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: If mismatch, bail
  if (!tabLabels.length || !tabPanels.length || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[idx];
    if (!panel) return;

    // Find the main contentfragment/article inside the panel
    let content = panel.querySelector('article') || panel;

    // Remove the contentfragment__title to avoid duplicate tab label
    const cfTitle = content.querySelector('.cmp-contentfragment__title');
    if (cfTitle) cfTitle.remove();

    // Use the full contentfragment__elements if present, else all children
    let tabContent;
    const cfElements = content.querySelector('.cmp-contentfragment__elements');
    if (cfElements) {
      // Remove empty grid wrappers
      Array.from(cfElements.querySelectorAll('.aem-Grid')).forEach(g => g.remove());
      // Collect all meaningful elements including images and links
      tabContent = Array.from(cfElements.childNodes).filter(n => {
        if (n.nodeType === 1) {
          // Remove empty grid wrappers
          if (n.classList && n.classList.contains('aem-Grid')) return false;
          // Remove empty divs
          if (n.tagName === 'DIV' && n.textContent.trim() === '') return false;
          return true;
        }
        // Keep text nodes with actual text
        return n.nodeType === 3 && n.textContent.trim();
      });
      // Ensure images and links are included from nested wrappers
      tabContent = tabContent.flatMap(node => {
        if (node.nodeType === 1) {
          // If node is a div and contains images or anchors, extract them
          const imgs = node.querySelectorAll && node.querySelectorAll('img');
          const links = node.querySelectorAll && node.querySelectorAll('a[href]');
          if (imgs && imgs.length) return Array.from(imgs);
          if (links && links.length) return Array.from(links);
        }
        return [node];
      });
      // If only one element, use it directly
      if (tabContent.length === 1) tabContent = tabContent[0];
    } else {
      // Fallback: use all children
      tabContent = Array.from(content.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      if (tabContent.length === 1) tabContent = tabContent[0];
    }

    // Defensive: If no content, use empty string
    if (!tabContent || (Array.isArray(tabContent) && tabContent.length === 0)) {
      tabContent = '';
    }

    rows.push([labelText, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the block table
  tabsContainer.replaceWith(block);
}
