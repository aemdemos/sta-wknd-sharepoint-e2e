/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // --- Extract heading, hero image, intro paragraph ---
  const heading = element.querySelector('.cmp-title__text');
  const heroImg = element.querySelector('.cmp-image__image');
  const introText = element.querySelector('.cmp-text p');
  const introCell = [];
  if (heading) introCell.push(heading.cloneNode(true));
  if (heroImg) introCell.push(heroImg.cloneNode(true));
  if (introText) introCell.push(introText.cloneNode(true));
  if (introCell.length) {
    rows.push([introCell]); // single cell row for intro
  }

  // --- Extract sidebar content ---
  const sidebarTitle = element.querySelector('.title .cmp-title__text');
  // The sidebar text block
  const sidebarText = element.querySelector('.cmp-text--font-small p');
  const sidebarCell = [];
  if (sidebarTitle) sidebarCell.push(sidebarTitle.cloneNode(true));
  if (sidebarText) sidebarCell.push(sidebarText.cloneNode(true));
  if (sidebarCell.length) {
    rows.push([sidebarCell]); // single cell row for sidebar
  }

  // --- Accordion items ---
  const accordionContainer = element.querySelector('.accordion .cmp-accordion');
  if (!accordionContainer) return;
  const items = accordionContainer.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: Find the button with the title span
    const button = item.querySelector('button.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    const titleCell = titleText;
    // Content cell: Find the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      const panelChildren = Array.from(panel.children);
      if (panelChildren.length === 1) {
        const container = panelChildren[0];
        if (container.classList.contains('container') || container.classList.contains('cmp-container')) {
          contentCell = Array.from(container.children);
        } else {
          contentCell = [container];
        }
      } else {
        contentCell = panelChildren;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the entire element with the block table (standalone)
  element.replaceWith(table);
}
