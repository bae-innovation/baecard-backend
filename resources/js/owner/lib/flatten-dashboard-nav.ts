import type { NavItem } from '@/components/shared/sidebar/nav-main';
import type { LucideIcon } from 'lucide-react';

export type FlatNavLink = {
  group: string;
  title: string;
  url: string;
  icon?: LucideIcon;
};

export function flattenDashboardNav(
  items: ReadonlyArray<NavItem>,
  parentGroup?: string,
): FlatNavLink[] {
  const links: FlatNavLink[] = [];

  for (const item of items) {
    const sectionGroup = item.url === '.' ? item.title : parentGroup ?? item.title;

    if (item.url && item.url !== '.') {
      links.push({
        group: parentGroup ?? item.title,
        title: item.title,
        url: item.url,
        icon: item.icon,
      });
    }

    if (item.items?.length) {
      const childGroup = item.url === '.' ? item.title : sectionGroup;
      links.push(...flattenDashboardNav(item.items, childGroup));
    }
  }

  return links;
}

export function dedupeNavLinksByUrl(links: ReadonlyArray<FlatNavLink>): FlatNavLink[] {
  const seen = new Set<string>();

  return links.filter((link) => {
    if (seen.has(link.url)) {
      return false;
    }

    seen.add(link.url);
    return true;
  });
}

export function groupNavLinks(links: ReadonlyArray<FlatNavLink>): Array<{
  group: string;
  items: FlatNavLink[];
}> {
  const groups: Array<{ group: string; items: FlatNavLink[] }> = [];
  const groupIndex = new Map<string, number>();

  for (const link of links) {
    const existingIndex = groupIndex.get(link.group);

    if (existingIndex === undefined) {
      groupIndex.set(link.group, groups.length);
      groups.push({ group: link.group, items: [link] });
    } else {
      groups[existingIndex].items.push(link);
    }
  }

  return groups;
}
