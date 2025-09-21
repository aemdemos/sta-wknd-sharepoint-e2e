/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('ol[role="tablist"] > li'));
  // Get tab panels (in order)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: must have same number of labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header must be exactly as specified
  const rows = [['Tabs (tabs8)']];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Find the contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Remove the contentfragment title (h3.cmp-contentfragment__title) if present
      const title = contentFragment.querySelector('h3.cmp-contentfragment__title');
      if (title) title.remove();
      // Create a div and append all remaining children
      tabContent = document.createElement('div');
      Array.from(contentFragment.childNodes).forEach((child) => {
        tabContent.appendChild(child.cloneNode(true));
      });
    } else {
      // Fallback: use panel's innerHTML
      tabContent = document.createElement('div');
      tabContent.innerHTML = panel.innerHTML;
    }

    rows.push([label, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
