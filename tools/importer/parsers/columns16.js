/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the main content column (center/main area)
  const mainColumn = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainColumn) return;

  // Try to get the sidebar, if present
  const aside = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  // --- MAIN COLUMN CONTENT --- //
  // We'll build a fragment of all relevant main content, in order.
  const mainColFragment = document.createDocumentFragment();

  // 1. Top main image ("hero")
  const topImage = element.querySelector(':scope > div > div.aem-Grid > div.image .cmp-image');
  if (topImage) {
    mainColFragment.appendChild(topImage);
  }

  // 2. Breadcrumbs
  const breadcrumb = element.querySelector(':scope > div > div.aem-Grid > div.breadcrumb');
  if (breadcrumb) {
    mainColFragment.appendChild(breadcrumb);
  }

  // 3. Title and Byline (inside mainColumn > container)
  const mainContainer = mainColumn.querySelector(':scope > div.cmp-container');
  if (mainContainer) {
    // Title
    const title1 = mainContainer.querySelector('.title .cmp-title h1');
    if (title1 && title1.parentNode && title1.parentNode.parentNode) {
      mainColFragment.appendChild(title1.parentNode.parentNode);
    }
    // Byline
    const byline = mainContainer.querySelector('.title .cmp-title h4');
    if (byline && byline.parentNode && byline.parentNode.parentNode) {
      mainColFragment.appendChild(byline.parentNode.parentNode);
    }
    // Article/contentfragment (main story)
    const article = mainContainer.querySelector('article.contentfragment');
    if (article) {
      mainColFragment.appendChild(article);
    }
  }

  // 4. Byline (author) block at the bottom
  // (Experiencefragment is after main content, not in aside)
  const expFrag = mainColumn.querySelector('.experiencefragment');
  if (expFrag) {
    mainColFragment.appendChild(expFrag);
  }

  // --- SIDEBAR CONTENT --- //
  let asideColFragment = null;
  if (aside) {
    const asideContainer = aside.querySelector(':scope > div.cmp-container');
    if (asideContainer) {
      asideColFragment = document.createDocumentFragment();
      Array.from(asideContainer.children).forEach(child => {
        asideColFragment.appendChild(child);
      });
    }
  }

  // --- Compose Columns block table --- //
  // Header row as per requirements
  const cells = [['Columns (columns16)']];
  // Second row: main and sidebar columns
  if (asideColFragment) {
    cells.push([mainColFragment, asideColFragment]);
  } else {
    cells.push([mainColFragment]);
  }

  // Create the columns block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}