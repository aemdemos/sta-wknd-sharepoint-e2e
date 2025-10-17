/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Accordion (accordion12)'];

  // Find the main content area
  const mainContent = element.querySelector('main.container.responsivegrid');
  if (!mainContent) return;

  // Find the article contentfragment
  const contentFragment = mainContent.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Get all elements inside the contentfragment's elements container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  const rows = [];
  const children = Array.from(elementsContainer.children);

  // 1. Find the intro paragraph and Wanderlust quote block
  let introPara = null;
  let quoteBlock = null;
  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains('cmp-text--quote')) {
      quoteBlock = children[i];
      // Look backwards for the first <p>
      for (let j = i - 1; j >= 0; j--) {
        if (children[j].tagName === 'P') {
          introPara = children[j];
          break;
        }
      }
      break;
    }
  }
  if (quoteBlock) {
    let titleText = 'Wanderlust';
    const blockquote = quoteBlock.querySelector('blockquote');
    if (blockquote) {
      const raw = blockquote.textContent.trim();
      const firstLine = raw.split('\n')[0].trim();
      if (firstLine) titleText = firstLine;
    }
    // Compose content: intro paragraph + quote block
    const content = [];
    if (introPara) content.push(introPara);
    content.push(quoteBlock);
    rows.push([titleText, content]);
  }

  // 2. For each h2, collect all content until the next h2
  for (let idx = 0; idx < children.length; idx++) {
    const child = children[idx];
    if (child.tagName === 'H2') {
      const title = child.textContent.trim();
      // Collect all siblings until next h2
      const content = [];
      for (let i = idx + 1; i < children.length; i++) {
        if (children[i].tagName === 'H2') break;
        content.push(children[i]);
      }
      // Defensive: If nothing found, fallback to heading only
      rows.push([title, content.length ? content : child]);
    }
  }

  // 3. Create the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the original element
  element.replaceWith(table);
}
