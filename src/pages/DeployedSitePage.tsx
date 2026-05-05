import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function DeployedSitePage() {
  const { username, siteId } = useParams();
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the deployed site's HTML
    fetch(`/sites/${username}/${siteId}/index.html`)
      .then((res) => res.text())
      .then((content) => {
        setHtml(content);
        setIsLoading(false);
      })
      .catch(() => {
        setHtml('<h1>Site not found</h1>');
        setIsLoading(false);
      });
  }, [username, siteId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
