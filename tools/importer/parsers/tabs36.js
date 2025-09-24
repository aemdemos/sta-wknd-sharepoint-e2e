/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct tab panels and tab labels
  function getTabsBlock(el) {
    // Find the tabs container
    const tabsContainer = el.querySelector('.tabs.panelcontainer, .cmp-tabs');
    // Defensive: .cmp-tabs may be nested inside .tabs.panelcontainer
    const cmpTabs = tabsContainer?.querySelector('.cmp-tabs') || tabsContainer;
    if (!cmpTabs) return null;
    // Get tab labels
    const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
    // Get tab panels
    const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
    return { tabLabels, tabPanels };
  }

  // Get tabs block info
  const tabsBlock = getTabsBlock(element);
  if (!tabsBlock) return;
  const { tabLabels, tabPanels } = tabsBlock;

  // Table header row
  const headerRow = ['Tabs (tabs36)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();
    // Defensive: get corresponding tab panel
    const panel = tabPanels[i];
    let tabContent;
    if (panel) {
      // Use the full contentfragment/article inside the panel as content
      // Defensive: find the main contentfragment/article
      const article = panel.querySelector('article.cmp-contentfragment') || panel;
      // For 'Overview' tab, include image if present
      if (labelText.toLowerCase() === 'overview') {
        // Find image block inside article
        const imageDiv = article.querySelector('.cmp-image');
        const image = imageDiv?.querySelector('img');
        // Find description paragraph
        const descP = article.querySelector('p');
        // Compose content: [image, caption, description]
        const contentArr = [];
        if (imageDiv) contentArr.push(imageDiv);
        if (descP) contentArr.push(descP);
        tabContent = contentArr.length ? contentArr : [article];
      } else {
        // For other tabs, use all main content (paragraphs, lists)
        // Find main content container inside article
        const elementsDiv = article.querySelector('.cmp-contentfragment__elements') || article;
        // Get all direct children that are <p> or <ul>
        const contentNodes = Array.from(elementsDiv.querySelectorAll('p, ul')).filter(n => n.textContent.trim());
        tabContent = contentNodes.length ? contentNodes : [article];
      }
    } else {
      tabContent = [''];
    }
    rows.push([labelText, tabContent]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
