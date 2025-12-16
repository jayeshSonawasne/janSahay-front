import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonMethodService } from 'src/app/core/services/common-method.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { HttpClient } from '@angular/common/http';

interface MenuItem {
  id: number;
  mainMenuId: number;
  mainMenu: string;
  subMenuId: number;
  subMenu: string;
  pageName: string;
  pageURL: string;
  menuIcon: string;
  isSideBarMenu: boolean;
}

interface SubModule {
  subMenuId: number;
  subMenu: string;
  names: PageLink[];
  collapsed?: boolean;
}

interface PageLink {
  name: string;
  url: string;
  isSideBar: boolean;
}

interface MenuModule {
  mainMenuId: number;
  mainMenu: string;
  subModules: SubModule[];
  collapsed?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  pageListModels: MenuModule[] = [];

  constructor(
    private webStorageService: WebStorageService,
    private router: Router,
    private commonMethodService: CommonMethodService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadMenuData();
  }

  /**
   * Loads menu data from JSON file and initializes the sidebar
   */
  private loadMenuData(): void {
    // In production, you might want to get this from webStorageService.getAllPageName()
    this.http.get<MenuItem[]>('assets/menu-data.json').subscribe({
      next: (menuItems) => {
        this.pageListModels = this.transformMenuData(menuItems);
        this.initializeSidebar();
      },
      error: (error) => {
        console.error('Error loading menu data:', error);
        // Fallback or error handling
      }
    });
  }

  /**
   * Transforms flat menu items into hierarchical structure
   */
  private transformMenuData(items: MenuItem[]): MenuModule[] {
    return items.reduce((modules: MenuModule[], item: MenuItem) => {
      const { mainMenuId, subMenuId, pageName, mainMenu, subMenu, pageURL, isSideBarMenu } = item;

      // Find or create main module
      let module = modules.find(m => m.mainMenuId === mainMenuId);
      if (!module) {
        module = { mainMenuId, mainMenu, subModules: [], collapsed: false };
        modules.push(module);
      }

      // Find or create sub module
      let subModule = module.subModules.find(s => s.subMenuId === subMenuId);
      if (!subModule) {
        subModule = { subMenuId, subMenu, names: [], collapsed: false };
        module.subModules.push(subModule);
      }

      // Add page link
      subModule.names.push({ name: pageName, url: pageURL, isSideBar: isSideBarMenu });

      return modules;
    }, []);
  }

  /**
   * Initializes sidebar state and event listeners
   */
  private initializeSidebar(): void {
    this.updateBreadcrumb();
    this.setActiveMenuOnPageLoad();
    this.subscribeToNavigationEvents();
  }

  /**
   * Subscribes to router navigation events
   */
  private subscribeToNavigationEvents(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumb();
        this.setActiveMenuOnPageLoad();
      });
  }

  /**
   * Collapses all menu items
   */
  private collapseAllMenus(): void {
    this.pageListModels.forEach(module => {
      module.collapsed = false;
      module.subModules.forEach(subModule => {
        subModule.collapsed = false;
      });
    });
  }

  /**
   * Sets active menu state based on current route
   */
  private setActiveMenuOnPageLoad(): void {
    this.collapseAllMenus();
    const currentPageName = this.commonMethodService.getPathName();

    for (let i = 0; i < this.pageListModels.length; i++) {
      const module = this.pageListModels[i];

      for (let j = 0; j < module.subModules.length; j++) {
        const subModule = module.subModules[j];
        const matchingPage = subModule.names.find(page => page.url === currentPageName);

        if (matchingPage) {
          this.pageListModels[i].collapsed = true;
          this.pageListModels[i].subModules[j].collapsed = true;
          return; // Exit once we find the match
        }
      }
    }
  }

  /**
   * Toggles menu expansion state
   * @param moduleIndex - Index of the main module
   * @param isMainMenu - Whether this is a main menu or submenu toggle
   * @param subModuleIndex - Index of the submenu (optional)
   */
  toggleMenuExpansion(moduleIndex: number, isMainMenu: boolean, subModuleIndex?: number): void {
    this.collapseAllMenus();

    if (isMainMenu) {
      this.pageListModels[moduleIndex].collapsed = true;
    } else if (subModuleIndex !== undefined) {
      this.pageListModels[moduleIndex].collapsed = true;
      this.pageListModels[moduleIndex].subModules[subModuleIndex].collapsed = true;
    }
  }

  /**
   * Updates breadcrumb based on current route
   */
  private updateBreadcrumb(): void {
    const currentPageName = this.commonMethodService.getPathName();

    for (const module of this.pageListModels) {
      for (const subModule of module.subModules) {
        const matchingPage = subModule.names.find(page => page.url === currentPageName);

        if (matchingPage) {
          const breadcrumbs = this.buildBreadcrumbs(module, subModule, matchingPage);
          this.webStorageService.breadCrumbObs.next(breadcrumbs);
          return;
        }
      }
    }
  }

  /**
   * Builds breadcrumb array based on menu hierarchy
   */
  private buildBreadcrumbs(module: MenuModule, subModule: SubModule, page: PageLink): string[] {
    // If submenu exists and has multiple pages, and main menu differs from submenu
    if (subModule.subMenu && subModule.names.length > 1 && module.mainMenu !== subModule.subMenu) {
      return [module.mainMenu, subModule.subMenu, page.name];
    }

    // If main menu equals submenu, skip the duplicate
    if (module.mainMenu === subModule.subMenu) {
      return [module.mainMenu, page.name];
    }

    // Default: just the page name
    return [page.name];
  }
}

