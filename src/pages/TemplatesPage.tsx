import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { Footer } from '@/sections/Footer';

export function TemplatesPage() {
  const navigate = useNavigate();
  const {
    templates,
    setTemplates,
    categories,
    setCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    user,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.templates.list({
        page: currentPage,
        limit: 24,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      setTemplates(result.templates);
      setTotalPages(result.totalPages);
      if (result.categories) setCategories(result.categories);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery, sortBy, setTemplates, setTotalPages, setCategories]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Load categories on first mount
  useEffect(() => {
    api.templates.categories().then((data) => {
      setCategories(data.categories);
    }).catch(() => {});
  }, [setCategories]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleUseTemplate = (templateId: string) => {
    if (!user) {
      // The username modal will show automatically
      return;
    }
    navigate(`/editor/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-[72px]">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">1000+ Premium Templates</h1>
          <p className="text-[#94a3b8]">Find the perfect template for your next project</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          className="sticky top-[72px] z-50 bg-[#0a0a0f]/95 backdrop-blur-xl py-4 mb-8 -mx-6 px-6 border-b border-[#27273a]/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-[#12121a] border-[#27273a] text-white placeholder:text-[#94a3b8]/50 focus:border-[#7c3aed]"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 px-4 rounded-lg bg-[#12121a] border border-[#27273a] text-white text-sm focus:border-[#7c3aed] outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="name">A-Z</option>
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[#7c3aed] text-white'
                  : 'bg-[#12121a] text-[#94a3b8] border border-[#27273a] hover:border-[#7c3aed]/50'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#7c3aed] text-white'
                    : 'bg-[#12121a] text-[#94a3b8] border border-[#27273a] hover:border-[#7c3aed]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-[#27273a] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-[#94a3b8]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                className="group bg-[#12121a] border border-[#27273a] rounded-2xl overflow-hidden hover:border-[#7c3aed]/30 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -8 }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-[#1a1a25]">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
                    >
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0a0a0f]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(template.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#1a1a25] text-[#94a3b8]">
                      {template.category}
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      {template.deployCount} deploys
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="border-[#27273a] text-white hover:bg-[#12121a]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[#94a3b8]">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="border-[#27273a] text-white hover:bg-[#12121a]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
