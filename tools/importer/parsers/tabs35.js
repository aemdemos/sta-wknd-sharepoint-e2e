/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the source HTML
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels and tab panels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabPanels = tabLabels.map(label => {
    const panelId = label.getAttribute('aria-controls');
    return tabsContainer.querySelector(`#${panelId}`);
  });

  // Table header: must use block name exactly
  const headerRow = ['Tabs (tabs35)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label text
    const tabLabelText = label.textContent.trim();

    // Tab content: preserve all semantic HTML within the tabpanel
    let tabContentFragment = document.createElement('div');
    // Find the contentfragment/article inside the panel, if present
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Only reference existing children, do not clone
      Array.from(contentFragment.children).forEach(child => {
        tabContentFragment.appendChild(child);
      });
    } else {
      // Otherwise, reference all children of the panel
      Array.from(panel.childNodes).forEach(child => {
        if (child.nodeType === 1 || child.nodeType === 3) {
          tabContentFragment.appendChild(child);
        }
      });
    }
    // Defensive: If tabContentFragment is empty, fallback to panel text
    if (!tabContentFragment.hasChildNodes()) {
      tabContentFragment.textContent = panel.textContent.trim();
    }

    rows.push([tabLabelText, tabContentFragment]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsContainer.parentNode.replaceChild(block, tabsContainer);
}
