'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ApiKeyBanner } from '@/components/ApiKeyBanner';
import { ChatInterface } from '@/components/ChatInterface';
import { Footer } from '@/components/Footer';
import { ToolCatalogModal } from '@/components/ToolCatalogModal';

export default function HomePage() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [status, setStatus] = useState<{ isMockMode: boolean; hasCredentials: boolean }>({
    isMockMode: false,
    hasCredentials: false,
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        isMockMode={status.isMockMode}
        hasCredentials={status.hasCredentials}
        onOpenToolCatalog={() => setIsCatalogOpen(true)}
      />

      {/* API Key Status Notice */}
      <ApiKeyBanner
        hasCredentials={status.hasCredentials}
        isMockMode={status.isMockMode}
      />

      {/* Main Chat Workspace */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatInterface onHealthUpdate={setStatus} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Tool Schema Explorer */}
      <ToolCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
}
