/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the contentfragment article: this is the main article area
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // 2. Find all section headings for accordion items: .cmp-title__text inside h2
  //    and gather content for each section until the next heading
  const sectionHeadings = Array.from(
    contentFragment.querySelectorAll('.cmp-title__text')
  ).filter(h => h.parentElement && /^h2$/i.test(h.tagName));

  // There may be extra h3/h4s (not h2s) for article title/byline, etc.
  // We'll only use the h2 section headings for accordion items.

  // 3. For robust collection, walk through all children in cmp-contentfragment__elements,
  //    and group content by section heading.
  const contentRoot = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;
  const children = Array.from(contentRoot.children);

  // Find all index positions for h2 headings
  let sectionIndexes = [];
  children.forEach((child, idx) => {
    const h2 = child.querySelector && child.querySelector('.cmp-title__text');
    if (h2 && /^h2$/i.test(h2.tagName)) {
      sectionIndexes.push(idx);
    }
  });
  // If no h2s found, do nothing
  if (!sectionIndexes.length) return;

  // 4. Prepare blocks for each accordion item
  const items = [];
  for (let i = 0; i < sectionIndexes.length; i++) {
    const from = sectionIndexes[i];
    const to = sectionIndexes[i+1] !== undefined ? sectionIndexes[i+1] : children.length;
    // Heading node for this section
    const headingDiv = children[from];
    const heading = headingDiv.querySelector('.cmp-title__text');
    // Title cell is the heading text (or heading element)
    const titleCell = heading;
    // Content cell: all elements after headingDiv until next headingDiv
    const contentEls = [];
    for(let j = from+1; j < to; j++) {
      // Only include non-empty elements
      if (children[j].textContent.trim() || children[j].querySelector('img,blockquote')) {
        contentEls.push(children[j]);
      }
    }
    // If only one block, use it, otherwise array
    items.push([titleCell, contentEls.length === 1 ? contentEls[0] : contentEls]);
  }

  // 5. Compose the block table
  const cells = [
    ['Accordion (accordion30)'],
    ...items
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
