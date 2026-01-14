import { useState, useEffect } from 'react'
import './App.css'

// Sample profile data (will be loaded from JSON)
const sampleProfile = {
  "clone_id": "elon_musk",
  "display_name": "Elon Musk",
  "tagline": "Visionário Tecnológico",
  "tier": 1,
  "apex_score": 94,
  "neural_data_files": 72,
  "top_skill": "First Principles Thinking",
  "top_skill_level": 5,
  "archetypes": {
    "mbti": { "type": "INTJ", "name": "The Architect", "stack": ["Ni", "Te", "Fi", "Se"] },
    "enneagram": { "type": 5, "wing": 8, "full_type": "5w8", "name": "The Iconoclast", "triad": "Head", "instinctual_variant": { "stack": "SP/SX/SO" } },
    "disc": { "primary": "DI", "secondary": "DC", "full_type": "DI/DC", "name": "Desenvolvedor Criativo", "scores": { "dominance": 92, "influence": 72, "steadiness": 22, "conscientiousness": 68 } },
    "cognitive_stratum": { "level": "VI-VII" }
  },
  "big_five": {
    "openness": { "score": 95, "label": "ABERTURA" },
    "conscientiousness": { "score": 82, "label": "CONSC." },
    "extraversion": { "score": 48, "label": "EXTROV." },
    "agreeableness": { "score": 32, "label": "AMABIL." },
    "neuroticism": { "score": 45, "label": "NEUROT." }
  },
  "disc_behaviors": {
    "specific_behaviors": [
      "Toma decisões rápidas baseadas em first principles",
      "Assume controle de situações e define direção",
      "Confronta diretamente sem receio de conflito",
      "Move extremamente rápido, impaciente com lentidão",
      "Comunica verdades difíceis sem rodeios"
    ]
  }
}

// Big Five Radar Component
function BigFiveRadar({ data }) {
  const traits = Object.entries(data);
  const centerX = 150;
  const centerY = 140;
  const maxRadius = 100;

  // Calculate points for pentagon
  const getPoint = (index, value, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Background pentagon rings
  const rings = [20, 40, 60, 80, 100];

  // Data polygon
  const dataPoints = traits.map(([_, trait], i) => getPoint(i, trait.score, traits.length));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="radar-container">
      <svg className="radar-svg" viewBox="0 0 300 280">
        {/* Background rings */}
        {rings.map((ring, ri) => {
          const ringPoints = traits.map((_, i) => getPoint(i, ring, traits.length));
          const ringPath = ringPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return <path key={ri} d={ringPath} fill="none" stroke="#2a3441" strokeWidth="1" />;
        })}

        {/* Axis lines */}
        {traits.map(([_, trait], i) => {
          const outer = getPoint(i, 100, traits.length);
          return <line key={i} x1={centerX} y1={centerY} x2={outer.x} y2={outer.y} stroke="#2a3441" strokeWidth="1" />;
        })}

        {/* Data polygon */}
        <path d={dataPath} fill="rgba(34, 211, 238, 0.2)" stroke="#22d3ee" strokeWidth="2" />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22d3ee" />
        ))}

        {/* Labels */}
        {traits.map(([key, trait], i) => {
          const labelPoint = getPoint(i, 120, traits.length);
          return (
            <text
              key={i}
              x={labelPoint.x}
              y={labelPoint.y}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {trait.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// DISC Bars Component
function DISCBars({ scores }) {
  const bars = [
    { key: 'd', label: 'Dominância (D)', value: scores.dominance, color: '#ef4444' },
    { key: 'i', label: 'Influência (I)', value: scores.influence, color: '#f59e0b' },
    { key: 's', label: 'Estabilidade (S)', value: scores.steadiness, color: '#10b981' },
    { key: 'c', label: 'Conformidade (C)', value: scores.conscientiousness, color: '#3b82f6' },
  ];

  return (
    <div className="disc-bars">
      {bars.map(bar => (
        <div className="disc-bar" key={bar.key}>
          <span className="disc-label" style={{ color: bar.color }}>{bar.label}</span>
          <div className="disc-track">
            <div
              className={`disc-fill ${bar.key}`}
              style={{ width: `${bar.value}%` }}
            />
          </div>
          <span className="disc-value">{bar.value}%</span>
        </div>
      ))}
    </div>
  );
}

// Main App
function App() {
  const [profile, setProfile] = useState(sampleProfile);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-icon">🧠</div>
          <div>
            <div className="header-title">Mentes Sintéticas</div>
            <div className="header-subtitle">Cognitive Core</div>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#">🎯 Mentes</a>
          <a href="#">⚡ Arena</a>
          <a href="#" className="active">📊 Pipeline</a>
          <a href="#">💠 DNA Mental</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Clone Header Card */}
        <div className="clone-header">
          <div className="clone-avatar">
            <div className="clone-avatar-placeholder">👤</div>
            <div className="clone-id">ID: {profile.clone_id.toUpperCase()}</div>
          </div>

          <div className="clone-info">
            <h1 className="clone-name">
              {profile.display_name}
              <span className="clone-tier">TIER {profile.tier.toString().padStart(2, '0')}</span>
            </h1>
            <div className="clone-tagline">{profile.tagline}</div>
            <div className="clone-badge">✦ SPECIFIC KNOWLEDGE</div>
          </div>

          <div className="clone-stats">
            <div className="clone-stat">
              <div className="clone-stat-label">Apex Score</div>
              <div className="clone-stat-value">{profile.apex_score}<span>/100</span></div>
            </div>
            <div className="clone-stat">
              <div className="clone-stat-label">Neural Data</div>
              <div className="clone-stat-value">{profile.neural_data_files}<span> files</span></div>
            </div>
            <div className="clone-stat">
              <div className="clone-stat-label">Top Skill</div>
              <div className="clone-stat-sub">{profile.top_skill}</div>
              <div className="clone-stat-sub">{'●'.repeat(profile.top_skill_level)}{'○'.repeat(5 - profile.top_skill_level)} LVL {profile.top_skill_level}</div>
            </div>
          </div>

          <div className="clone-actions">
            <button className="clone-action-btn">⚙️</button>
            <button className="clone-action-btn primary">▶</button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column - Archetypes */}
          <div className="card">
            <h2 className="card-title">
              <span className="card-title-icon">🎭</span>
              ARQUÉTIPOS PSICOLÓGICOS
            </h2>

            <div className="archetypes-grid">
              <div className="archetype-item">
                <div className="archetype-label">MBTI</div>
                <div className="archetype-value">{profile.archetypes.mbti.type}</div>
                <div className="archetype-name">{profile.archetypes.mbti.name}</div>
                <div className="archetype-stack">
                  {profile.archetypes.mbti.stack.map(fn => (
                    <span key={fn}>{fn}</span>
                  ))}
                </div>
              </div>

              <div className="archetype-item">
                <div className="archetype-label">ENEAGRAMA</div>
                <div className="archetype-value">{profile.archetypes.enneagram.full_type}</div>
                <div className="archetype-name">{profile.archetypes.enneagram.triad} Triad</div>
                <div className="archetype-variant">Variante: {profile.archetypes.enneagram.instinctual_variant.stack}</div>
              </div>

              <div className="archetype-item">
                <div className="archetype-label">DISC</div>
                <div className="archetype-value">{profile.archetypes.disc.full_type}</div>
                <div className="archetype-name">{profile.archetypes.disc.name}</div>
              </div>

              <div className="archetype-item">
                <div className="archetype-label">ESTRATO COGNITIVO</div>
                <div className="archetype-value">{profile.archetypes.cognitive_stratum.level}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Big Five */}
          <div className="card">
            <h2 className="card-title">
              <span className="card-title-icon">📊</span>
              BIG FIVE (OCEAN)
            </h2>
            <BigFiveRadar data={profile.big_five} />
          </div>

          {/* DISC Behaviors - Full Width */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h2 className="card-title">
              <span className="card-title-icon">📈</span>
              DISC - COMPORTAMENTO OBSERVÁVEL
            </h2>

            <DISCBars scores={profile.archetypes.disc.scores} />

            <h3 className="card-title" style={{ marginTop: '1.5rem' }}>
              COMPORTAMENTOS ESPECÍFICOS
            </h3>
            <ul className="behaviors-list">
              {profile.disc_behaviors.specific_behaviors.map((behavior, i) => (
                <li key={i}>{behavior}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
