/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block within the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels (li elements in tablist)
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tablist ? Array.from(tablist.querySelectorAll('li')).map(li => li.textContent.trim()) : [];

  // Get all tab panels (order should match labels)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build the block table
  const headerRow = ['Tabs (tabs23)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentToInclude = [];
    if (panel) {
      // Find the content fragment's main content inside the panel
      const cfElements = panel.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        // Gather only meaningful children (paragraphs, lists, images, etc)
        const children = Array.from(cfElements.children).filter(child => {
          // Exclude grid placeholder divs
          if (child.querySelector && child.querySelector('.aem-Grid')) return false;
          // Exclude empty divs
          if ((child.tagName === 'DIV' || child.tagName === 'SPAN') && !child.textContent.trim() && !child.querySelector('img,ul,li,p')) return false;
          return true;
        });
        if (children.length > 0) {
          contentToInclude = children;
        } else {
          // If everything filtered, include the cfElements itself
          contentToInclude = [cfElements];
        }
      } else {
        // Fallback: exclude h3 title if present, include the rest
        contentToInclude = Array.from(panel.children).filter(child => !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title')));
        if (!contentToInclude.length) {
          contentToInclude = [panel];
        }
      }
    }
    // Fallback: If content is empty, include the full panel
    if (!contentToInclude.length && panel) {
      contentToInclude = [panel];
    }
    rows.push([label, contentToInclude]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabs.replaceWith(table);
}
