/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  // Defensive: If not found, try to find by cmp-tabs class
  const cmpTabs = tabsContainer || element.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map(li => li.textContent.trim());

  // Get tab panels (one per tab)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];

  // Model fields for comments (from model: wknd-shared/models/adventure)
  // The fields are: Description, Itinerary, What to Bring
  const modelFields = ['Description', 'Itinerary', 'What to Bring'];

  // For each tab, extract label and content
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the model field for this tab if possible
    let fieldName = modelFields[i] || label;
    // Tab content: collect all direct children of the tabpanel
    let content;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      const children = Array.from(panel.children);
      content = children.length === 1 ? children[0] : children;
    }
    // Add HTML comment for model field before the content
    const cellContent = document.createDocumentFragment();
    cellContent.appendChild(document.createComment(` ${fieldName} `));
    if (Array.isArray(content)) {
      content.forEach(node => cellContent.appendChild(node.cloneNode(true)));
    } else {
      cellContent.appendChild(content.cloneNode(true));
    }
    rows.push([label, cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  cmpTabs.replaceWith(block);
}
