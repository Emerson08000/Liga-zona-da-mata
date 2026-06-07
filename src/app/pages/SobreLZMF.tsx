import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useState } from 'react';

export function SobreLZMF() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeLeague, setActiveLeague] = useState<'futsal' | 'campo'>('futsal');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} activeLeague={activeLeague} setActiveLeague={setActiveLeague} />
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#0f4c2e] hover:underline mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-10 bg-[#d4af37] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f4c2e]">Liga Zona da Mata de Futebol</h1>
          </div>

          <div className="prose prose-green max-w-none text-gray-700 space-y-5 text-sm md:text-base leading-relaxed">
            <p>
              A <strong>Liga Zona da Mata de Futebol</strong> é uma entidade esportiva fundada no ano de <strong>2019</strong>, inicialmente com o nome de <strong>Liga Desportiva Lajense</strong>. Com o passar dos anos, ampliou sua atuação e passou a representar toda a região da Zona da Mata Alagoana, tornando-se uma importante referência na promoção e organização de competições esportivas.
            </p>
            <p>
              A Liga desenvolve um trabalho voltado para o fortalecimento do futebol de base e adulto, realizando campeonatos e torneios nas modalidades de <strong>Futebol de Campo</strong>, <strong>Futebol 7</strong> e <strong>Futsal</strong>. Seu objetivo é incentivar a prática esportiva, promover a inclusão social e proporcionar oportunidades para atletas de diferentes municípios da região.
            </p>
            <p>
              Ao longo de sua trajetória, a entidade tem contribuído para a descoberta de novos talentos e para o crescimento do esporte alagoano, reunindo equipes, atletas, dirigentes e torcedores em competições organizadas e de grande relevância regional.
            </p>
            <p>
              Sob a presidência de <strong>Edjunior de Macena Barbosa</strong>, a Liga Zona da Mata de Futebol segue comprometida com o desenvolvimento esportivo, buscando sempre oferecer competições de qualidade, fortalecer o futebol regional e incentivar a formação de novos atletas.
            </p>
            <p>
              Com seriedade, organização e compromisso, a Liga Zona da Mata de Futebol continua escrevendo sua história e contribuindo para o crescimento do esporte na Zona da Mata de Alagoas.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Fundação', value: '2019' },
              { label: 'Presidente', value: 'Edjunior de Macena Barbosa' },
              { label: 'Modalidades', value: 'Campo, Futsal, Futebol 7' },
            ].map(item => (
              <div key={item.label} className="bg-[#0f4c2e]/5 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                <div className="font-semibold text-[#0f4c2e] text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
