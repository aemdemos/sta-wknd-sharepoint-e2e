/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by tag name
  function getImmediateChildrenByTag(parent, tag) {
    return Array.from(parent.children).filter(child => child.tagName.toLowerCase() === tag);
  }

  // Find the main contentfragment article (the core story)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container inside the contentfragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect accordion items as [title, content] pairs
  const items = [];

  // We'll walk through the children of elementsContainer
  // and group them into accordion items: each item starts with a title (h2), followed by content (including images, paragraphs, etc.) until the next h2 or end
  let currentTitle = null;
  let currentContent = [];

  // Flatten all children (including those inside nested divs)
  function flattenChildren(node) {
    let result = [];
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === 1 && child.tagName.toLowerCase() === 'div' && child.children.length > 0) {
        result = result.concat(flattenChildren(child));
      } else {
        result.push(child);
      }
    });
    return result;
  }

  const allChildren = flattenChildren(elementsContainer);

  allChildren.forEach((child) => {
    if (child.nodeType === 1 && child.tagName.match(/^H2$/i)) {
      // If we already have a title, push previous item
      if (currentTitle) {
        if (currentContent.length > 0) {
          items.push([currentTitle, currentContent]);
        }
      }
      currentTitle = child;
      currentContent = [];
    } else {
      // If we have a title, collect content
      if (currentTitle) {
        // Only collect non-empty text or elements
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          currentContent.push(child);
        }
      }
    }
  });
  // Push last item
  if (currentTitle && currentContent.length > 0) {
    items.push([currentTitle, currentContent]);
  }

  // Special case: If there's content before the first h2, treat it as the first accordion item
  // Find all nodes before the first h2
  let preH2Content = [];
  for (let i = 0; i < allChildren.length; i++) {
    const child = allChildren[i];
    if (child.nodeType === 1 && child.tagName.match(/^H2$/i)) {
      break;
    }
    if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
      preH2Content.push(child);
    }
  }
  if (preH2Content.length > 0) {
    // Try to find a title for this section (use the h3 in the contentfragment if present)
    let preTitle = contentFragment.querySelector('.cmp-contentfragment__title');
    if (!preTitle) {
      // fallback: use the h1 from the main title block
      preTitle = element.querySelector('.cmp-title h1');
    }
    if (preTitle) {
      items.unshift([preTitle, preH2Content]);
    }
  }

  // Compose the table rows
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];
  items.forEach(([title, content]) => {
    // Defensive: if content is only one element, use it directly, else use array
    const contentCell = content.length === 1 ? content[0] : content;
    rows.push([title, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
