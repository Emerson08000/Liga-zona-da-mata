import { useState } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { NewsSection } from '../components/NewsSection';
import { StandingsSection } from '../components/StandingsSection';
import { MatchesSection } from '../components/MatchesSection';
import { UpcomingGames } from '../components/UpcomingGames';
import { Footer } from '../components/Footer';

export function HomePage() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeLeague, setActiveLeague] = useState<'futsal' | 'campo'>('futsal');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        activeLeague={activeLeague}
        setActiveLeague={setActiveLeague}
      />
      <Hero activeLeague={activeLeague} />
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div id="noticias-section">
              <NewsSection activeLeague={activeLeague} />
            </div>
            <div id="jogos-section">
              <MatchesSection activeLeague={activeLeague} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <UpcomingGames activeLeague={activeLeague} />
            <div id="classificacao-section">
              <StandingsSection activeLeague={activeLeague} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
