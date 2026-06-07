import { useNavigate } from 'react-router-dom';
import logoPoliglotas from '../../imports/logo-poliglotas.png';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useState } from 'react';

export function TimesFiliados() {
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-10 bg-[#d4af37] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#0f4c2e]">Times Filiados</h1>
          </div>

          {/* POLIGLOTAS */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
            <div className="bg-[#0f4c2e] px-6 py-4 flex items-center gap-4">
              <img src={logoPoliglotas} alt="Poliglotas E.C." className="w-14 h-14 object-contain rounded-lg bg-white p-1 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-white">Poliglotas Futsal</h2>
                <p className="text-green-300 text-xs mt-0.5">São José da Laje, Alagoas • Fundado em 2004</p>
              </div>
            </div>
            <div className="p-6 text-gray-700 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                O <strong>Poliglotas Futsal</strong> foi criado por um grupo de amigos e fundado no ano de <strong>2004</strong>, na cidade de <strong>São José da Laje, Alagoas</strong>. Durante grande parte de sua trajetória, a equipe foi administrada por <strong>Maninho</strong> e <strong>Diogo</strong>, que contribuíram significativamente para o crescimento e fortalecimento do clube.
              </p>
              <p>
                Atualmente, o Poliglotas tem como presidente <strong>Jolderson "Tchotcho"</strong>, dando continuidade à história de tradição e conquistas da equipe.
              </p>
              <p>
                Reconhecido como o <strong>maior campeão do futsal lajense</strong> desde a construção do Ginásio Poliesportivo Militão, em 2003, o Poliglotas construiu uma trajetória vitoriosa ao longo dos anos.
              </p>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-[#d4af37]" />
                  <span className="font-bold text-[#0f4c2e]">Principais Títulos</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { titulo: 'Campeão Lajense', ano: '2004' },
                    { titulo: 'Bicampeão Lajense', ano: '2010' },
                    { titulo: 'Tricampeão Lajense', ano: '2012' },
                    { titulo: 'Tetracampeão Lajense', ano: '2025' },
                  ].map(t => (
                    <div key={t.ano} className="flex items-center gap-3 bg-[#0f4c2e]/5 rounded-xl px-4 py-3">
                      <div className="w-2 h-2 bg-[#d4af37] rounded-full flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-[#0f4c2e] text-xs">{t.titulo}</div>
                        <div className="text-xs text-gray-500">{t.ano}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm">
                🏆 <strong>Vice-campeão</strong> do Campeonato Regional Alagoano em <strong>2015</strong>.
              </div>

              <p>
                Após um período afastado das quadras, o Poliglotas retornou às competições mantendo sua tradição e competitividade, continuando a representar com orgulho o esporte lajense. Ao longo de sua história, a equipe também conquistou diversos torneios e competições locais, consolidando-se como uma das agremiações mais respeitadas do futsal da região.
              </p>
            </div>
          </div>

          {/* JUNIOR-AL */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
            <div className="bg-[#0f4c2e] px-6 py-4">
              <h2 className="text-lg font-bold text-white">Junior-AL</h2>
              <p className="text-green-300 text-xs mt-0.5">São José da Laje, Alagoas • Fundado em 2016</p>
            </div>
            <div className="p-6 text-gray-700 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                O <strong>Junior-AL</strong> é um clube esportivo da cidade de <strong>São José da Laje, Alagoas</strong>, fundado em <strong>2016</strong> pelo empresário e desportista <strong>Edjunior de Macena Barbosa</strong>. O projeto nasceu com o objetivo de incentivar a prática esportiva, promover a inclusão social e revelar talentos do futebol e do futsal da região.
              </p>
              <p>
                Desde sua fundação, o clube tem desenvolvido um trabalho voltado para a formação de atletas, oferecendo oportunidades para crianças e jovens que sonham em seguir carreira no esporte. Com dedicação e planejamento, o Junior-AL cresceu rapidamente, tornando-se uma das principais referências esportivas da Zona da Mata alagoana.
              </p>
              <p>
                Além de sua atuação em competições regionais, o clube conquistou espaço no cenário estadual ao participar por <strong>duas temporadas consecutivas</strong> do <strong>Campeonato Alagoano de Futebol de Campo</strong>, alcançando resultados expressivos e ficando entre as <strong>oito melhores equipes do estado</strong>. Essas campanhas demonstraram a força do trabalho desenvolvido pelo clube e a qualidade dos atletas formados em São José da Laje.
              </p>
              <p>
                No futsal, o Junior-AL também construiu sua trajetória de sucesso, sendo filiado à <strong>Federação Alagoana de Futsal</strong> e participando de competições oficiais que fortalecem o esporte no estado.
              </p>
              <p>
                Ao longo dos anos, o Junior-AL tem sido mais do que um clube esportivo. Tornou-se um <strong>projeto de transformação social</strong>, utilizando o esporte como ferramenta de educação, disciplina e cidadania. Com trabalho sério e compromisso com a juventude, o clube segue escrevendo sua história e levando o nome de São José da Laje para todo o estado de Alagoas.
              </p>

              {/* Ficha do clube */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Fundação', value: '2016' },
                  { label: 'Cidade', value: 'São José da Laje, AL' },
                  { label: 'Fundador', value: 'Edjunior de Macena Barbosa' },
                  { label: 'Modalidades', value: 'Futebol de Campo e Futsal' },
                ].map(item => (
                  <div key={item.label} className="bg-[#0f4c2e]/5 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-500 mb-0.5">{item.label}</div>
                    <div className="font-semibold text-[#0f4c2e] text-sm">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
                🎯 <strong>Missão:</strong> Formar atletas, promover inclusão social e desenvolver o esporte na região.
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">Mais times em breve.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
