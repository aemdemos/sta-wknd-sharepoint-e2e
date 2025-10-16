/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find the actual tabs block inside the container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content areas)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: ensure labels and panels are paired
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table header row
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    let tabContent = [];
    let modelComment = null;

    // Try to find the contentfragment/article inside the panel
    const fragment = panel.querySelector('article.cmp-contentfragment');
    if (fragment) {
      // Remove the repeated title (h3) if present
      const fragClone = fragment.cloneNode(true);
      const h3 = fragClone.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      tabContent = Array.from(fragClone.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      // If the model is present, add a comment
      const model = fragment.getAttribute('data-cmp-contentfragment-model');
      if (model) {
        modelComment = document.createComment(` model: ${model} `);
        // Extract all field names from .cmp-contentfragment__element-title
        const fields = Array.from(fragClone.querySelectorAll('.cmp-contentfragment__element-title'));
        fields.forEach(field => {
          const fieldName = field.textContent.trim();
          tabContent.unshift(document.createComment(` field: ${fieldName} `));
        });
      }
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    }

    // Insert the model comment at the start of tabContent if present
    if (modelComment) tabContent.unshift(modelComment);

    rows.push([label, tabContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs container with the block table
  tabsContainer.replaceWith(table);
}
