/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (from the tablist)
  const tablist = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.querySelectorAll('[role="tab"]') : []);

  // Get tab panels (content)
  // The order of tabPanels should match tabLabels
  const tabPanels = tabLabels.map(tabLabel => {
    const controls = tabLabel.getAttribute('aria-controls');
    if (controls) {
      return tabsRoot.querySelector(`#${controls}`);
    }
    return null;
  });

  // Compose the header row (block name)
  const headerRow = ['Tabs (tabs8)'];

  // Compose tab rows: [Tab Label, Tab Content]
  const tabRows = tabLabels.map((tabLabel, idx) => {
    const tabName = tabLabel.textContent.trim();
    const panel = tabPanels[idx];
    let tabContent;
    if (panel) {
      // For resilience, grab everything inside the panel as one element
      // Prefer .contentfragment if available, otherwise all panel children
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else if (panel.childNodes.length === 1) {
        tabContent = panel.firstElementChild;
      } else {
        // Create a wrapper div for all children
        const wrapper = document.createElement('div');
        Array.from(panel.childNodes).forEach(node => wrapper.appendChild(node));
        tabContent = wrapper;
      }
    } else {
      tabContent = document.createTextNode(''); // fallback to empty
    }
    return [tabName, tabContent];
  });

  // Assemble table
  const cells = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original tabs block with block table
  tabsRoot.parentNode.replaceChild(block, tabsRoot);
}
