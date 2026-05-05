import { create } from 'zustand';

interface User {
  username: string;
  deploysToday: number;
  credits: number;
  joinDate: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  deployCount: number;
  createdAt: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Templates
  templates: Template[];
  setTemplates: (templates: Template[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;

  // Editor
  selectedTemplate: any | null;
  setSelectedTemplate: (template: any | null) => void;
  customizations: Record<string, string>;
  setCustomizations: (customizations: Record<string, string>) => void;
  updateCustomization: (fieldId: string, value: string) => void;

  // Admin
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  adminToken: string;
  setAdminToken: (token: string) => void;

  // Settings
  siteSettings: any;
  setSiteSettings: (settings: any) => void;

  // Deployments
  deployments: any[];
  setDeployments: (deployments: any[]) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),

  templates: [],
  setTemplates: (templates) => set({ templates }),
  categories: [],
  setCategories: (categories) => set({ categories }),
  selectedCategory: 'All',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, currentPage: 1 }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  totalPages: 1,
  setTotalPages: (totalPages) => set({ totalPages }),

  selectedTemplate: null,
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
  customizations: {},
  setCustomizations: (customizations) => set({ customizations }),
  updateCustomization: (fieldId, value) =>
    set((state) => ({
      customizations: { ...state.customizations, [fieldId]: value },
    })),

  isAdmin: false,
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  adminToken: localStorage.getItem('adminToken') || '',
  setAdminToken: (adminToken) => {
    localStorage.setItem('adminToken', adminToken);
    set({ adminToken });
  },

  siteSettings: null,
  setSiteSettings: (siteSettings) => set({ siteSettings }),

  deployments: [],
  setDeployments: (deployments) => set({ deployments }),
}));
