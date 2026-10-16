import { useState } from 'react'
import './App.css'

const CAMPOS = [
  { id: 'nome', rotulo: 'Nome da solução', tipo: 'texto' },
  {
    id: 'tecnologia',
    rotulo: 'Tecnologia',
    tipo: 'lista',
    opcoes: ['Power Apps', 'Power Automate', 'Copilot', 'Power BI'],
  },
  {
    id: 'objetivo',
    rotulo: 'Qual é o objetivo da solução?',
    tipo: 'lista',
    opcoes: ['Uso Interno', 'Uso Departamental', 'Uso Empresarial'],
  },
  {
    id: 'dados',
    rotulo: 'Qual é o tipo dos dados utilizados?',
    tipo: 'lista',
    opcoes: ['Dados públicos', 'Dados confidenciais'],
  },
  {
    id: 'escalavel',
    rotulo: 'A solução é escalável para reuso?',
    tipo: 'opcao',
    opcoes: ['Sim', 'Não'],
  },
  {
    id: 'regulatorio',
    rotulo: 'A solução está relacionada a processos regulatórios?',
    tipo: 'opcao',
    opcoes: ['Sim', 'Não'],
  },
  {
    id: 'integracao',
    rotulo: 'A solução tem integração com algum sistema?',
    tipo: 'lista',
    opcoes: ['Integração Externa', 'Integração Interna'],
  },
  {
    id: 'suporte',
    rotulo: 'Qual é o nível de suporte da solução?',
    tipo: 'lista',
    opcoes: ['24/7', '8/5'],
  },
]

const CRITERIOS = [
  {
    descricao: 'Solução de uso empresarial',
    atende: (respostas) => respostas.objetivo === 'Uso Empresarial',
  },
  {
    descricao: 'Utiliza dados confidenciais',
    atende: (respostas) => respostas.dados === 'Dados confidenciais',
  },
  {
    descricao: 'É escalável para reuso',
    atende: (respostas) => respostas.escalavel === 'Sim',
  },
  {
    descricao: 'Relacionada a processos regulatórios',
    atende: (respostas) => respostas.regulatorio === 'Sim',
  },
  {
    descricao: 'Possui integração externa',
    atende: (respostas) => respostas.integracao === 'Integração Externa',
  },
  {
    descricao: 'Exige suporte 24/7',
    atende: (respostas) => respostas.suporte === '24/7',
  },
]

const criarRespostasVazias = () =>
  Object.fromEntries(CAMPOS.map(({ id }) => [id, '']))

function App() {
  const [respostas, setRespostas] = useState(criarRespostasVazias)
  const [resultado, setResultado] = useState(null)

  const camposRespondidos = CAMPOS.filter(({ id }) =>
    String(respostas[id]).trim(),
  ).length

  function alterarResposta(id, valor) {
    setRespostas((atuais) => ({ ...atuais, [id]: valor }))
    setResultado(null)
  }

  function avaliarSolucao(evento) {
    evento.preventDefault()
    const motivos = CRITERIOS.filter(({ atende }) => atende(respostas)).map(
      ({ descricao }) => descricao,
    )

    setResultado({
      id: `AUT-${Date.now().toString(36).toUpperCase()}`,
      nome: respostas.nome.trim(),
      governada: motivos.length > 0,
      motivos,
    })
  }

  function limparFormulario() {
    setRespostas(criarRespostasVazias())
    setResultado(null)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Elegibilidade, início">
          <span className="brand-mark" aria-hidden="true">E</span>
          <span>Elegibilidade</span>
        </a>
        <span className="topbar-label">Governança de soluções digitais</span>
      </header>

      <main className="page-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">AVALIAÇÃO DE SOLUÇÃO</p>
          <h1 id="page-title">Sua solução precisa ser governada?</h1>
          <p className="intro-copy">
            Responda às perguntas abaixo para receber uma orientação de
            governança para sua solução.
          </p>
        </section>

        <div className="workspace">
          <section className="form-card" aria-labelledby="form-title">
            <div className="card-heading">
              <div>
                <p className="section-kicker">QUESTIONÁRIO</p>
                <h2 id="form-title">Sobre a solução</h2>
              </div>
              <span className="required-note">* Obrigatório</span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="Progresso do questionário"
              aria-valuemin={0}
              aria-valuemax={CAMPOS.length}
              aria-valuenow={camposRespondidos}
            >
              <span
                className="progress-value"
                style={{ width: `${(camposRespondidos / CAMPOS.length) * 100}%` }}
              />
            </div>
            <p className="progress-label">
              {camposRespondidos} de {CAMPOS.length} perguntas respondidas
            </p>

            <form onSubmit={avaliarSolucao}>
              <div className="field-grid">
                {CAMPOS.map((campo, indice) => (
                  <div
                    className={`field field-${campo.tipo}${campo.tipo === 'texto' || campo.id === 'regulatorio' ? ' field-wide' : ''}`}
                    key={campo.id}
                  >
                    {campo.tipo === 'opcao' ? (
                      <fieldset className="choice-field">
                        <legend>
                          <span className="field-number">
                            {String(indice + 1).padStart(2, '0')}
                          </span>
                          {campo.rotulo}
                          <span className="required-mark" aria-hidden="true">*</span>
                        </legend>
                        <div className="choice-options">
                          {campo.opcoes.map((opcao) => (
                            <label className="choice-option" key={opcao}>
                              <input
                                type="radio"
                                name={campo.id}
                                value={opcao}
                                checked={respostas[campo.id] === opcao}
                                onChange={(evento) =>
                                  alterarResposta(campo.id, evento.target.value)
                                }
                                required
                              />
                              <span>{opcao}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <label className="input-field" htmlFor={campo.id}>
                        <span className="input-label">
                          <span className="field-number">
                            {String(indice + 1).padStart(2, '0')}
                          </span>
                          {campo.rotulo}
                          <span className="required-mark" aria-hidden="true">*</span>
                        </span>
                        {campo.tipo === 'texto' ? (
                          <input
                            id={campo.id}
                            type="text"
                            value={respostas[campo.id]}
                            onChange={(evento) =>
                              alterarResposta(campo.id, evento.target.value)
                            }
                            placeholder="Ex.: Portal de atendimento"
                            required
                          />
                        ) : (
                          <select
                            id={campo.id}
                            value={respostas[campo.id]}
                            onChange={(evento) =>
                              alterarResposta(campo.id, evento.target.value)
                            }
                            required
                          >
                            <option value="" disabled>
                              Selecione uma opção
                            </option>
                            {campo.opcoes.map((opcao) => (
                              <option key={opcao} value={opcao}>
                                {opcao}
                              </option>
                            ))}
                          </select>
                        )}
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button className="button button-primary" type="submit">
                  Ver resultado
                  <span aria-hidden="true">→</span>
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={limparFormulario}
                >
                  Limpar respostas
                </button>
              </div>
            </form>
          </section>

          <aside className="aside-column">
            <section className="info-card">
              <span className="info-icon" aria-hidden="true">i</span>
              <h2>Como funciona</h2>
              <p>
                As respostas são avaliadas por critérios de dados, escala,
                integração, suporte e contexto de uso.
              </p>
              <p>
                Se pelo menos um critério de governança for identificado, a
                solução será sinalizada para avaliação.
              </p>
            </section>

            {resultado ? (
              <section
                className={`result-card ${resultado.governada ? 'result-warning' : 'result-success'}`}
                aria-live="polite"
                aria-labelledby="result-title"
              >
                <p className="section-kicker">RESULTADO DA AVALIAÇÃO</p>
                <span className="result-status">
                  {resultado.governada ? 'Requer atenção' : 'Baixo risco identificado'}
                </span>
                <h2 id="result-title">
                  {resultado.governada
                    ? 'Deve ser governada'
                    : 'Não precisa ser governada'}
                </h2>
                <p className="result-name">{resultado.nome}</p>
                {resultado.governada ? (
                  <div className="reason-list">
                    <p className="reason-title">Critérios identificados</p>
                    <ul>
                      {resultado.motivos.map((motivo) => (
                        <li key={motivo}>{motivo}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="result-explanation">
                    Nenhum dos critérios de governança definidos foi identificado
                    nas respostas.
                  </p>
                )}
                <p className="result-id">Avaliação {resultado.id}</p>
              </section>
            ) : (
              <section className="placeholder-card" aria-live="polite">
                <span className="placeholder-icon" aria-hidden="true">✓</span>
                <h2>Seu resultado aparecerá aqui</h2>
                <p>
                  Preencha o questionário e selecione “Ver resultado” para
                  consultar a avaliação.
                </p>
              </section>
            )}
          </aside>
        </div>

        <p className="disclaimer">
          Esta avaliação é uma orientação inicial e não substitui a análise das
          áreas responsáveis.
        </p>
      </main>
    </div>
  )
}

export default App
