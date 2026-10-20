// Liga cada rota de administracao ao modulo usado nas permissoes por departamento.
// Rotas desconhecidas devolvem null e ficam sempre permitidas.
// A pagina de Permissoes e propositadamente excluida: e o simulador de departamento.
const rules: [RegExp, string][] = [
  [/\/admin\/oportunidades/, 'Oportunidades'],
  [/\/admin\/empresas/, 'Empresas'],
  [/\/admin\/eventos/, 'Eventos'],
  [/\/admin\/estudantes/, 'Estudantes'],
  [/\/admin\/competencias/, 'Competências'],
  [/\/admin\/formacao/, 'Formação'],
  [/\/admin\/certificados/, 'Certificados'],
  [/\/admin\/desafios/, 'Desafios'],
  [/\/admin\/debates/, 'Debates'],
  [/\/admin\/avaliacoes|\/admin\/feedback/, 'Feedback'],
  [/\/admin\/conteudo/, 'Conteúdo'],
  [/\/admin\/(denuncias|reclamacoes|complaints)/, 'Denúncias'],
  [/\/admin\/(relatorios|reports)/, 'Relatórios'],
  [/\/admin\/(arquivo|archive)/, 'Arquivo'],
  [/\/admin\/(auditoria|audit)/, 'Auditoria'],
  // ANCHOR:department-rules
]

export function moduleForPath(path: string): string | null {
  const p = path.toLowerCase()
  for (const [rx, module] of rules) {
    if (rx.test(p)) return module
  }
  return null
}
