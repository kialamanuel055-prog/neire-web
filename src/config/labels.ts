import type {
  ApplicationStatus,
  CompanyStatus,
  Modality,
  OpportunityStatus,
  OpportunityType,
  SkillLevel,
} from '@/types'

export type Tone = 'gray' | 'blue' | 'green' | 'red' | 'amber'

export const typeLabels: Record<OpportunityType, string> = {
  estagio: 'Estágio',
  emprego: 'Emprego',
  formacao: 'Formação',
  bolsa: 'Bolsa',
  concurso: 'Concurso',
  voluntariado: 'Voluntariado',
  mentoria: 'Mentoria',
}

export const modalityLabels: Record<Modality, string> = {
  presencial: 'Presencial',
  remoto: 'Remoto',
  hibrido: 'Híbrido',
}

export const opportunityStatusLabels: Record<OpportunityStatus, string> = {
  pendente: 'Pendente de validação',
  publicada: 'Publicada',
  encerrada: 'Encerrada',
  rejeitada: 'Rejeitada',
}

export const opportunityTone: Record<OpportunityStatus, Tone> = {
  pendente: 'amber',
  publicada: 'green',
  encerrada: 'gray',
  rejeitada: 'red',
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  enviada: 'Candidatura enviada',
  em_analise: 'Em análise',
  pre_selecionado: 'Pré-selecionado',
  entrevista: 'Entrevista',
  selecionado: 'Selecionado',
  nao_selecionado: 'Não selecionado',
}

export const applicationFlow: ApplicationStatus[] = [
  'enviada',
  'em_analise',
  'pre_selecionado',
  'entrevista',
  'selecionado',
]

export const applicationTone: Record<ApplicationStatus, Tone> = {
  enviada: 'gray',
  em_analise: 'blue',
  pre_selecionado: 'blue',
  entrevista: 'amber',
  selecionado: 'green',
  nao_selecionado: 'red',
}

export const skillLevelLabels: Record<SkillLevel, string> = {
  declarada: 'Declarada',
  comprovada: 'Comprovada',
  validada: 'Validada',
}

export const skillTone: Record<SkillLevel, Tone> = {
  declarada: 'gray',
  comprovada: 'blue',
  validada: 'green',
}

export const companyStatusLabels: Record<CompanyStatus, string> = {
  pendente: 'Pendente',
  em_analise: 'Em análise',
  verificada: 'Verificada',
  ativa: 'Ativa',
}

export const companyTone: Record<CompanyStatus, Tone> = {
  pendente: 'gray',
  em_analise: 'amber',
  verificada: 'blue',
  ativa: 'green',
}

export const companyFlow: CompanyStatus[] = ['pendente', 'em_analise', 'verificada', 'ativa']

export const areas = ['Tecnologia', 'Telecomunicações', 'Engenharia', 'Gestão', 'Marketing', 'Finanças']
export const experienceLevels = ['Sem experiência', 'Júnior', 'Pleno', 'Sénior']
export const skillCategories = ['Programação', 'Tecnologia', 'Competências profissionais']
export const eventTypes = [
  'Fórum',
  'Workshop',
  'Palestra',
  'Debate',
  'Hackathon',
  'Feira',
  'Visita técnica',
  'Sessão empresarial',
]
export const mentorshipStatusLabels: Record<'pendente' | 'aceite' | 'recusada', string> = {
  pendente: 'Pendente',
  aceite: 'Aceite',
  recusada: 'Recusada',
}

export const mentorshipTone: Record<'pendente' | 'aceite' | 'recusada', Tone> = {
  pendente: 'amber',
  aceite: 'green',
  recusada: 'red',
}
export const challengeStatusLabels: Record<'pendente' | 'ativo' | 'encerrado' | 'rejeitado', string> = {
  pendente: 'Pendente de validação',
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  rejeitado: 'Rejeitado',
}

export const challengeTone: Record<'pendente' | 'ativo' | 'encerrado' | 'rejeitado', Tone> = {
  pendente: 'amber',
  ativo: 'green',
  encerrado: 'gray',
  rejeitado: 'red',
}

export const debateStatusLabels: Record<'inscricoes' | 'em_curso' | 'terminado', string> = {
  inscricoes: 'Inscrições abertas',
  em_curso: 'Em curso',
  terminado: 'Terminado',
}

export const debateTone: Record<'inscricoes' | 'em_curso' | 'terminado', Tone> = {
  inscricoes: 'blue',
  em_curso: 'amber',
  terminado: 'gray',
}

export const complaintStatusLabels: Record<'recebida' | 'em_analise' | 'resolvida', string> = {
  recebida: 'Recebida',
  em_analise: 'Em análise',
  resolvida: 'Resolvida',
}

export const complaintTone: Record<'recebida' | 'em_analise' | 'resolvida', Tone> = {
  recebida: 'gray',
  em_analise: 'amber',
  resolvida: 'green',
}

export const complaintCategories = [
  'Discriminação',
  'Favoritismo',
  'Assédio',
  'Abuso de posição',
  'Irregularidade em processo seletivo',
  'Outro',
]

export const archiveCategories = [
  'Estatuto',
  'Regulamento',
  'Plano',
  'Relatório',
  'Protocolo',
  'Ata',
  'Documento financeiro',
  'Documento de transição',
]
// ANCHOR:labels
