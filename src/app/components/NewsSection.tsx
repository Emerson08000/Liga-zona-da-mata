import { ImageWithFallback } from './figma/ImageWithFallback';
import { Calendar, ArrowRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface NewsSectionProps {
  activeLeague: 'futsal' | 'campo';
}

export function NewsSection({ activeLeague }: NewsSectionProps) {
  const { news } = useAdmin();

  // Filtrar notícias por liga
  const newsItems = news
    .filter(item => item.league === activeLeague || item.league === 'both')
    .slice(0, 6); // Mostrar até 6 notícias
  return (
    <section className="mb-6 md:mb-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl text-gray-900">Últimas Notícias</h2>
        <button
          onClick={() => {
            const element = document.getElementById('noticias-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-[#0f4c2e] hover:gap-3 transition-all text-sm md:text-base"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {newsItems.length > 0 ? newsItems.map((news) => (
          <article key={news.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <ImageWithFallback
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 md:top-4 md:left-4">
                <span className="px-2 py-1 md:px-3 bg-[#0f4c2e] text-white text-xs rounded-full">
                  {news.category}
                </span>
              </div>
            </div>
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span>{news.date}</span>
              </div>
              <h3 className="text-base md:text-lg mb-2 text-gray-900 hover:text-[#0f4c2e] transition-colors line-clamp-2">
                {news.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {news.excerpt}
              </p>
            </div>
          </article>
        )) : (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <p className="text-sm">Nenhuma notícia disponível no momento</p>
          </div>
        )}
      </div>
    </section>
  );
}
