/* global WebImporter */
export default function parse(element, { document }) {
  // Find the top .cmp-container
  const mainContainer = element.querySelector('.cmp-container');
  if (!mainContainer) return;

  // Find the main content column (the first <main> with a .cmp-container that contains the article)
  let mainCol = [];
  const mainContent = element.querySelector('main.container .cmp-container');
  if (mainContent) {
    // Main image (top of page)
    const mainImageDiv = mainContent.querySelector('.image');
    if (mainImageDiv) mainCol.push(mainImageDiv);
    // Breadcrumb (if present)
    const breadcrumb = mainContent.querySelector('.breadcrumb');
    if (breadcrumb) mainCol.push(breadcrumb);
    // All title blocks (including h1, h4, and h2)
    const titles = mainContent.querySelectorAll('.title');
    titles.forEach(title => mainCol.push(title));
    // Article contentfragment
    const article = mainContent.querySelector('article.contentfragment');
    if (article) mainCol.push(article);
    // Experiencefragment author byline
    const experienceFragment = mainContent.querySelector('.experiencefragment');
    if (experienceFragment) mainCol.push(experienceFragment);
  }

  // Find the sidebar column (the <aside> with .cmp-container)
  let sideCol = [];
  const aside = element.querySelector('aside.container .cmp-container');
  if (aside) {
    // All direct children in the sidebar grid are considered (title, sharing, list, etc.)
    const sidebarBlocks = Array.from(aside.children).filter(child => child.classList.length > 0);
    sideCol = sidebarBlocks;
  }

  // Ensure both columns arrays exist, even if empty
  if (!mainCol.length && !sideCol.length) return;

  // --- FIX: Build header row as a single cell only as in the markdown example ---
  // Second row has as many columns as needed (here always 2 for Columns block)
  const headerRow = ['Columns']; // single cell header row
  const dataRow = [mainCol, sideCol]; // main and sidebar columns

  const table = WebImporter.DOMUtils.createTable([headerRow, dataRow], document);
  element.replaceWith(table);
}
