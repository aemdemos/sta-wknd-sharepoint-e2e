/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let tabsRoot = tabsContainer;
  if (!tabsRoot || !tabsRoot.classList.contains('cmp-tabs')) {
    tabsRoot = tabsContainer && tabsContainer.querySelector('.cmp-tabs');
  }
  if (!tabsRoot) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  ).map((li) => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[role="tabpanel"]')
  );

  // Defensive: Only proceed if we have matching labels and panels
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs38)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentElements = [];
    // If there's a contentfragment/article inside, use its children
    const fragment = panel.querySelector('article.cmp-contentfragment');
    if (fragment) {
      // For the Overview tab, ensure we include the hero image if present
      if (i === 0) {
        // Look for the main image inside the contentfragment
        const image = fragment.querySelector('.cmp-image');
        if (image) {
          contentElements.push(image);
        }
      }
      // Use all children except the repeated title
      Array.from(fragment.children).forEach((child) => {
        // Skip the h3 title if present
        if (child.classList && child.classList.contains('cmp-contentfragment__title')) return;
        // If it's a wrapper, flatten its children
        if (child.classList && child.classList.contains('cmp-contentfragment__elements')) {
          Array.from(child.children).forEach((subchild) => {
            // Defensive: skip empty grid wrappers
            if (subchild.classList && subchild.classList.contains('aem-Grid')) return;
            // If it's a wrapper, flatten further
            if (subchild.children && subchild.children.length > 0) {
              Array.from(subchild.children).forEach((deepchild) => {
                if (deepchild.classList && deepchild.classList.contains('aem-Grid')) return;
                contentElements.push(deepchild);
              });
            } else {
              contentElements.push(subchild);
            }
          });
        } else {
          contentElements.push(child);
        }
      });
    } else {
      // Fallback: use all children of the panel
      Array.from(panel.children).forEach((child) => {
        contentElements.push(child);
      });
    }
    // Remove empty grid wrappers and layout artifacts
    contentElements = contentElements.filter(
      (el) => el && !(el.classList && (el.classList.contains('aem-Grid') || el.classList.contains('aem-GridColumn') || el.classList.contains('cmp-contentfragment__title')))
    );
    // Remove empty divs
    contentElements = contentElements.filter((el) => {
      if (el.tagName === 'DIV' && el.children.length === 0 && el.textContent.trim() === '') return false;
      return true;
    });
    rows.push([label, contentElements.length === 1 ? contentElements[0] : contentElements]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
