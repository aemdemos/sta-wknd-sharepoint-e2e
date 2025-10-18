/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tab navigation (tab labels)
  const tabNav = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find all tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure tab labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row (must match block name exactly)
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // Try to get the model fields from the first contentfragment (if present)
  let modelFields = [];
  const firstPanel = tabPanels[0];
  if (firstPanel) {
    const cf = firstPanel.querySelector('.contentfragment');
    if (cf) {
      const model = cf.getAttribute('data-cmp-contentfragment-model');
      if (model) {
        // Try to get the model fields from the data-cmp-data-layer attribute
        const dataLayer = cf.getAttribute('data-cmp-data-layer');
        if (dataLayer) {
          try {
            // Find the first key in the dataLayer JSON
            const parsed = JSON.parse(dataLayer);
            const firstKey = Object.keys(parsed)[0];
            const elements = parsed[firstKey]?.elements;
            if (Array.isArray(elements)) {
              modelFields = elements.map(e => e['xdm:title']);
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }
  }

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab content panel
    const panel = tabPanels[i];
    if (!panel) return;

    // Extract tab content (preserve structure)
    // Find the contentfragment inside the panel
    const cf = panel.querySelector('.contentfragment');
    let tabContent;
    if (cf) {
      // Use the article inside contentfragment if present
      const article = cf.querySelector('article');
      if (article) {
        // Use the cmp-contentfragment__elements as main content if present
        const elements = article.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          tabContent = elements;
        } else {
          tabContent = article;
        }
      } else {
        tabContent = cf;
      }
    } else {
      tabContent = panel;
    }

    // Defensive: If tabContent is empty, create an empty div
    if (!tabContent || !tabContent.textContent.trim()) {
      tabContent = document.createElement('div');
    }

    // If modelFields exist, add HTML comment before tab content
    let cellContent = tabContent;
    if (modelFields.length > 0) {
      const comment = document.createComment(` model fields: ${modelFields.join(', ')} `);
      const wrapper = document.createElement('div');
      wrapper.appendChild(comment);
      wrapper.appendChild(tabContent);
      cellContent = wrapper;
    }

    rows.push([labelText, cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
