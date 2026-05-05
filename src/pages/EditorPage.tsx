import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Rocket,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut,
  Copy,
  ExternalLink,
  PartyPopper,
  Type,
  Image,
  Palette,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/store/useStore';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { HexColorPicker } from 'react-colorful';

export function EditorPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { user, selectedTemplate, setSelectedTemplate, customizations, setCustomizations, updateCustomization } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('content');
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Load template
  useEffect(() => {
    if (!templateId) return;
    
    // Check if we already have this template loaded
    if (selectedTemplate?.id === templateId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    api.templates.get(templateId)
      .then((template) => {
        setSelectedTemplate(template);
        // Initialize customizations with defaults
        const defaults: Record<string, string> = {};
        template.fields.forEach((field: any) => {
          defaults[field.id] = field.default || '';
        });
        setCustomizations(defaults);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load template:', err);
        toast.error('Failed to load template');
        navigate('/templates');
      });
  }, [templateId, selectedTemplate, setSelectedTemplate, setCustomizations, navigate]);

  // Update preview when customizations change
  const updatePreview = useCallback(() => {
    if (!selectedTemplate || !previewRef.current) return;

    let html = selectedTemplate.html;
    let css = selectedTemplate.css;

    selectedTemplate.fields.forEach((field: any) => {
      const value = customizations[field.id] !== undefined ? customizations[field.id] : (field.default || '');
      const regex = new RegExp(`{{${field.id}}}`, 'g');

      if (field.type === 'image') {
        html = html.replace(regex, value);
      } else if (field.type === 'color') {
        css = css.replace(regex, value);
        html = html.replace(regex, value);
      } else {
        html = html.replace(regex, escapeHtml(value));
      }
    });

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>${css}</style>
</head>
<body>${html}</body>
</html>`;

    previewRef.current.srcdoc = fullHtml;
  }, [selectedTemplate, customizations]);

  useEffect(() => {
    const timeout = setTimeout(updatePreview, 300);
    return () => clearTimeout(timeout);
  }, [updatePreview]);

  function escapeHtml(text: string) {
    if (typeof text !== 'string') return text;
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const handleDeploy = async () => {
    if (!user || !selectedTemplate) return;
    setIsDeploying(true);
    try {
      const result = await api.deploy.deploy(user.username, selectedTemplate.id, customizations);
      if (result.success) {
        setDeployResult(result);
        toast.success('Website deployed successfully!');
        // Update user state
        const userData = await api.auth.getUser(user.username);
        if (userData.success) {
          useStore.getState().setUser({
            ...user,
            deploysToday: userData.deploysToday,
            credits: userData.credits,
          });
        }
      } else {
        toast.error(result.error || 'Deployment failed');
      }
    } catch {
      toast.error('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const textFields = selectedTemplate?.fields?.filter((f: any) => f.type === 'text') || [];
  const imageFields = selectedTemplate?.fields?.filter((f: any) => f.type === 'image') || [];
  const colorFields = selectedTemplate?.fields?.filter((f: any) => f.type === 'color') || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col pt-[72px]">
      {/* Deploy Success Modal */}
      <AnimatePresence>
        {deployResult && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(10,10,15,0.95)] backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1a1a25] border border-[#27273a] rounded-3xl p-10 max-w-[500px] w-full mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Website Deployed!</h2>
              <p className="text-[#94a3b8] mb-6">Your website is now live at:</p>

              <div className="bg-[#12121a] rounded-xl p-4 mb-6 flex items-center gap-3">
                <code className="text-sm text-[#06b6d4] flex-1 text-left truncate">
                  {window.location.origin}{deployResult.url}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}${deployResult.url}`);
                    toast.success('URL copied!');
                  }}
                  className="p-2 rounded-lg hover:bg-[#27273a] transition-colors"
                >
                  <Copy className="w-4 h-4 text-[#94a3b8]" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => window.open(`${window.location.origin}${deployResult.url}`, '_blank')}
                  className="flex-1 h-12 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold rounded-xl"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
                <Button
                  onClick={() => {
                    setDeployResult(null);
                    navigate('/templates');
                  }}
                  variant="outline"
                  className="flex-1 h-12 border-[#27273a] text-white hover:bg-[#12121a] rounded-xl"
                >
                  Deploy Another
                </Button>
              </div>

              <p className="text-xs text-[#94a3b8] mt-4">
                Remaining: {deployResult.remainingDeploys} deploys
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Header */}
      <div className="h-14 bg-[#12121a] border-b border-[#27273a] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/templates')}
            className="p-2 rounded-lg hover:bg-[#1a1a25] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#94a3b8]" />
          </button>
          <h2 className="font-semibold text-sm">{selectedTemplate?.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Viewport Toggle */}
          <div className="hidden md:flex items-center gap-1 bg-[#0a0a0f] rounded-lg p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-[#27273a] text-white' : 'text-[#94a3b8]'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-[#27273a] text-white' : 'text-[#94a3b8]'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-[#27273a] text-white' : 'text-[#94a3b8]'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1.5 rounded text-[#94a3b8] hover:bg-[#1a1a25]">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#94a3b8] w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 25))} className="p-1.5 rounded text-[#94a3b8] hover:bg-[#1a1a25]">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Deploy Button */}
          <Button
            onClick={handleDeploy}
            disabled={isDeploying || !user}
            className="h-9 px-5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white font-semibold rounded-lg hover:from-[#6d28d9] hover:to-[#0891b2]"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Rocket className="w-4 h-4 mr-2" />
            )}
            Deploy
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-[400px] min-w-[320px] bg-[#12121a] border-r border-[#27273a] overflow-y-auto flex-shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 bg-[#0a0a0f] p-1 m-4 mb-2 w-auto">
              <TabsTrigger value="content" className="data-[state=active]:bg-[#1a1a25] data-[state=active]:text-white text-[#94a3b8] text-xs">
                <Type className="w-3 h-3 mr-1" /> Content
              </TabsTrigger>
              <TabsTrigger value="style" className="data-[state=active]:bg-[#1a1a25] data-[state=active]:text-white text-[#94a3b8] text-xs">
                <Palette className="w-3 h-3 mr-1" /> Style
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#1a1a25] data-[state=active]:text-white text-[#94a3b8] text-xs">
                <Settings className="w-3 h-3 mr-1" /> SEO
              </TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="px-4 pb-4 space-y-6 mt-0">
              {/* Text Fields */}
              {textFields.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#94a3b8] uppercase mb-3 flex items-center gap-2">
                    <Type className="w-3 h-3" /> Text Content
                  </h4>
                  <div className="space-y-3">
                    {textFields.map((field: any) => (
                      <div key={field.id}>
                        <label className="text-xs text-[#94a3b8] mb-1 block">{field.label}</label>
                        <input
                          type="text"
                          value={customizations[field.id] || ''}
                          onChange={(e) => updateCustomization(field.id, e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-sm text-white focus:border-[#7c3aed] outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Fields */}
              {imageFields.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#94a3b8] uppercase mb-3 flex items-center gap-2">
                    <Image className="w-3 h-3" /> Images
                  </h4>
                  <div className="space-y-3">
                    {imageFields.map((field: any) => (
                      <div key={field.id}>
                        <label className="text-xs text-[#94a3b8] mb-1 block">{field.label}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customizations[field.id] || ''}
                            onChange={(e) => updateCustomization(field.id, e.target.value)}
                            placeholder="Image URL..."
                            className="flex-1 h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-sm text-white focus:border-[#7c3aed] outline-none transition-colors"
                          />
                        </div>
                        {customizations[field.id] && (
                          <img
                            src={customizations[field.id]}
                            alt={field.label}
                            className="mt-2 w-full h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="px-4 pb-4 space-y-6 mt-0">
              {colorFields.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#94a3b8] uppercase mb-3 flex items-center gap-2">
                    <Palette className="w-3 h-3" /> Colors
                  </h4>
                  <div className="space-y-4">
                    {colorFields.map((field: any) => (
                      <div key={field.id}>
                        <label className="text-xs text-[#94a3b8] mb-2 block">{field.label}</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setColorPickerOpen(colorPickerOpen === field.id ? null : field.id)}
                            className="w-10 h-10 rounded-lg border-2 border-[#27273a] flex-shrink-0 transition-transform hover:scale-105"
                            style={{ background: customizations[field.id] || field.default }}
                          />
                          <input
                            type="text"
                            value={customizations[field.id] || ''}
                            onChange={(e) => updateCustomization(field.id, e.target.value)}
                            className="flex-1 h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-sm text-white font-mono focus:border-[#7c3aed] outline-none"
                          />
                        </div>
                        <AnimatePresence>
                          {colorPickerOpen === field.id && (
                            <motion.div
                              className="mt-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <HexColorPicker
                                color={customizations[field.id] || field.default}
                                onChange={(color) => updateCustomization(field.id, color)}
                                style={{ width: '100%' }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="settings" className="px-4 pb-4 space-y-4 mt-0">
              <div>
                <label className="text-xs text-[#94a3b8] mb-1 block">Page Title</label>
                <input
                  type="text"
                  value={customizations.title || ''}
                  onChange={(e) => updateCustomization('title', e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#0a0a0f] border border-[#27273a] text-sm text-white focus:border-[#7c3aed] outline-none"
                />
              </div>
              <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[#27273a]">
                <h4 className="text-xs font-semibold text-[#94a3b8] mb-2">Template Info</h4>
                <p className="text-xs text-[#94a3b8]">Name: {selectedTemplate?.name}</p>
                <p className="text-xs text-[#94a3b8]">Category: {selectedTemplate?.category}</p>
                <p className="text-xs text-[#94a3b8]">Total deploys: {selectedTemplate?.deployCount || 0}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-[#0a0a0f] flex items-center justify-center p-4 overflow-auto">
          <div
            style={{
              width: getViewportWidth(),
              height: '100%',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'width 0.3s ease',
            }}
          >
            <iframe
              ref={previewRef}
              className="w-full h-full rounded-lg border border-[#27273a] bg-white"
              sandbox="allow-scripts"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
