import type { CourseKind } from '@/types'

export const courseKindLabels: Record<CourseKind, string> = {
  curso: 'Curso',
  workshop: 'Workshop',
  bootcamp: 'Bootcamp',
  masterclass: 'Masterclass',
}

export const newsCategories = ['Oportunidades', 'Resultados', 'Eventos', 'Conquistas', 'Parceiros']

export const evidenceTypes = ['Certificado', 'Projeto', 'Teste', 'Avaliação', 'Recomendação']

export const feedbackCriteria = [
  { key: 'qualidade', label: 'Qualidade' },
  { key: 'organizacao', label: 'Organização' },
  { key: 'utilidade', label: 'Utilidade' },
  { key: 'acessibilidade', label: 'Acessibilidade' },
  { key: 'experiencia', label: 'Experiência' },
]

export interface Department {
  id: string
  name: string
  scope: string
  modules: string[]
}

export const adminModules = [
  'Oportunidades', 'Empresas', 'Eventos', 'Estudantes', 'Competências', 'Formação',
  'Certificados', 'Desafios', 'Debates', 'Feedback', 'Conteúdo', 'Denúncias',
  'Relatórios', 'Arquivo', 'Auditoria', 'Permissões',
]

export const departments: Department[] = [
  { id: 'geral', name: 'Administração Geral', scope: 'Acesso total.', modules: adminModules },
  { id: 'direcao', name: 'Direção', scope: 'Visão estratégica, relatórios e supervisão.', modules: ['Relatórios', 'Auditoria', 'Arquivo', 'Denúncias', 'Oportunidades', 'Empresas', 'Estudantes'] },
  { id: 'empregabilidade', name: 'Empregabilidade', scope: 'Vagas, candidatos e Banco de Talentos.', modules: ['Oportunidades', 'Estudantes', 'Competências'] },
  { id: 'relacoes', name: 'Relações Empresariais', scope: 'Empresas, parceiros e protocolos.', modules: ['Empresas', 'Desafios', 'Arquivo'] },
  { id: 'formacao', name: 'Formação', scope: 'Cursos, workshops e participantes.', modules: ['Formação', 'Certificados', 'Feedback'] },
  { id: 'eventos', name: 'Eventos', scope: 'Eventos, inscrições e participantes.', modules: ['Eventos', 'Debates', 'Feedback'] },
  { id: 'projetos', name: 'Projetos', scope: 'Desafios, equipas e projetos.', modules: ['Desafios', 'Debates'] },
  { id: 'marketing', name: 'Marketing', scope: 'Notícias, campanhas e comunicação.', modules: ['Conteúdo'] },
]

export const roleHierarchy = [
  'Administrador Geral',
  'Direção',
  'Diretor de Departamento',
  'Coordenador',
  'Membro',
  'Estudante',
  'Empresa',
]
