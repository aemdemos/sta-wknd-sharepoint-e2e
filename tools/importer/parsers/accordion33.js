/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area that contains the contentfragment
  const mainSection = element.querySelector('main > div > main');
  if (!mainSection) return;
  // Locate the content fragment article
  const cf = mainSection.querySelector('article.contentfragment');
  if (!cf) return;
  // Get the .cmp-contentfragment__elements as the parent of accordion items
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  const rows = [];
  const headerRow = ['Accordion (accordion33)'];
  rows.push(headerRow);

  // We'll process by walking through direct children of .cmp-contentfragment__elements
  // Each accordion item is: [title, content], where title comes from an H2 (except for intro)
  // The intro section (before first H2) is an accordion item as well

  const cfChildren = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1 && (n.tagName || '').toLowerCase() !== 'script');

  let i = 0;
  // Process intro section (before first H2)
  let introTitleEl = null;
  let introContentEls = [];
  while (i < cfChildren.length) {
    const node = cfChildren[i];
    if (node.tagName && node.tagName.toLowerCase() === 'h2') break;
    // Use first <p> as intro title
    if (!introTitleEl && node.tagName && node.tagName.toLowerCase() === 'p') {
      introTitleEl = node;
    } else if (node.tagName && node.tagName.toLowerCase() === 'div' && node.querySelector('.cmp-image')) {
      introContentEls.push(node);
    }
    i++;
  }
  if (introTitleEl || introContentEls.length) {
    const contentCell = introContentEls.length > 1 ? introContentEls : (introContentEls.length === 1 ? introContentEls[0] : '');
    rows.push([
      introTitleEl ? introTitleEl : '',
      contentCell
    ]);
  }

  // Process each accordion section (from H2 on)
  while (i < cfChildren.length) {
    // Find the next H2
    while (i < cfChildren.length && (cfChildren[i].tagName || '').toLowerCase() !== 'h2') i++;
    if (i >= cfChildren.length) break;
    const h2 = cfChildren[i];
    const sectionTitle = h2;
    i++;
    // Gather all content up to next H2
    const contentEls = [];
    while (i < cfChildren.length && (cfChildren[i].tagName || '').toLowerCase() !== 'h2') {
      const node = cfChildren[i];
      // Accept paragraphs or images
      if (node.tagName && node.tagName.toLowerCase() === 'p') {
        contentEls.push(node);
      } else if (node.tagName && node.tagName.toLowerCase() === 'div' && node.querySelector('.cmp-image')) {
        contentEls.push(node);
      }
      i++;
    }
    let contentCell;
    if (contentEls.length > 1) {
      contentCell = contentEls;
    } else if (contentEls.length === 1) {
      contentCell = contentEls[0];
    } else {
      contentCell = '';
    }
    rows.push([
      sectionTitle,
      contentCell
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  cf.replaceWith(block);
}
