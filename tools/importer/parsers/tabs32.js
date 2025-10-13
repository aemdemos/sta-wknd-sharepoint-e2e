/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the main article)
  const mainArticle = element.querySelector('main.container.responsivegrid');
  if (!mainArticle) return;

  // Find the main heading (h1) and byline (h4) for the first tab
  const mainHeading = mainArticle.querySelector('h1');
  const byline = mainArticle.querySelector('h4');

  // Find the main article contentfragment (where the story is)
  const contentFragment = mainArticle.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = Array.from(contentFragment.children);

  // Find all indices of divs with h2 (tab headings)
  const tabIdxs = cfElements
    .map((el, idx) => el.tagName === 'DIV' && el.querySelector('h2') ? idx : -1)
    .filter(idx => idx !== -1);

  // Helper: get content between indices
  function getContent(start, end) {
    return cfElements.slice(start, end).filter(Boolean);
  }

  // Tabs: each major section
  const tabSections = [];

  // First tab: everything before first h2
  let firstTabEnd = tabIdxs.length > 0 ? tabIdxs[0] : cfElements.length;
  let firstTabContent = getContent(0, firstTabEnd);
  // Prepend byline if present
  if (byline) firstTabContent.unshift(byline.parentElement);
  // Prepend main heading if present
  if (mainHeading) firstTabContent.unshift(mainHeading.parentElement);
  tabSections.push({
    label: mainHeading ? mainHeading.textContent.trim() : 'Tab 1',
    content: firstTabContent
  });

  // Next tabs: for each h2, label is h2 text, content is all nodes until next h2
  for (let t = 0; t < tabIdxs.length; t++) {
    const idx = tabIdxs[t];
    const divWithH2 = cfElements[idx];
    const h2 = divWithH2.querySelector('h2');
    const label = h2 ? h2.textContent.trim() : `Tab ${t + 2}`;
    const nextIdx = t + 1 < tabIdxs.length ? tabIdxs[t + 1] : cfElements.length;
    let contentNodes = [divWithH2, ...getContent(idx + 1, nextIdx)];
    tabSections.push({ label, content: contentNodes });
  }

  // Table header row
  const headerRow = ['Tabs (tabs32)'];
  // Each tab: [label, content]
  const rows = tabSections.map(tab => [tab.label, tab.content]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
