import type { Course, GraduateProfile, ImpactStory, NewsItem } from '@/types'

export const seedCourses: Course[] = [
  {
    id: 'k1',
    title: 'Workshop: Entrevista de emprego',
    kind: 'workshop',
    description: 'Prepara-te para entrevistas: comunicação, perguntas comuns e simulação.',
    instructor: 'Equipa NEIRE',
    startDate: '2026-11-08',
    hours: 3,
    capacity: 40,
    enrolled: ['s3'],
    completed: [],
  },
  {
    id: 'k2',
    title: 'Curso de Python para Dados',
    kind: 'curso',
    description: 'Introdução prática a Python, análise de dados e visualização.',
    instructor: 'Alumni Demo',
    startDate: '2026-11-15',
    hours: 20,
    capacity: 30,
    enrolled: [],
    completed: [],
  },
  {
    id: 'k3',
    title: 'Masterclass: Carreiras em Cibersegurança',
    kind: 'masterclass',
    description: 'Conversa com profissionais sobre como entrar na área.',
    instructor: 'Convidado externo',
    startDate: '2026-12-02',
    hours: 2,
    capacity: 100,
    enrolled: [],
    completed: [],
  },
]

export const seedNews: NewsItem[] = [
  {
    id: 'n1',
    title: 'NEIRE lança a plataforma digital de oportunidades',
    category: 'Oportunidades',
    summary: 'Estudantes, empresas e Alumni passam a ter um único espaço para oportunidades e candidaturas.',
    body: 'A plataforma reúne vagas, estágios, formações e eventos num só lugar, com acompanhamento transparente de cada candidatura.',
    date: '2026-10-15',
    published: true,
  },
  {
    id: 'n2',
    title: 'Abertas as inscrições para o Fórum de Empregabilidade',
    category: 'Eventos',
    summary: 'Um encontro entre estudantes, Alumni e empresas parceiras.',
    body: 'Inscreve-te na área de Eventos da plataforma. As vagas são limitadas.',
    date: '2026-10-18',
    published: true,
  },
]

export const seedStories: ImpactStory[] = [
  {
    id: 'h1',
    title: 'Da sala de aula ao primeiro emprego',
    personName: 'Alumni Demo',
    role: 'Engenheiro de redes',
    story: 'Participou num programa do NEIRE, fez um estágio numa empresa parceira e hoje orienta estudantes como mentor.',
    date: '2026-10-10',
    published: true,
  },
]

export const seedGraduates: GraduateProfile[] = [
  {
    userId: 'u2',
    name: 'Alumni Demo',
    graduationYear: '2024',
    company: 'Telecom Horizonte',
    position: 'Engenheiro de redes',
    bio: 'Gosto de ajudar estudantes a entrar na área de redes e telecomunicações.',
    offersMentoring: true,
  },
]
