export type Role = 'student' | 'alumni' | 'company' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export type OpportunityType = 'estagio' | 'emprego' | 'formacao' | 'bolsa' | 'concurso' | 'voluntariado' | 'mentoria'
export type OpportunityStatus = 'pendente' | 'publicada' | 'encerrada' | 'rejeitada'
export type Modality = 'presencial' | 'remoto' | 'hibrido'

export interface Opportunity {
  id: string
  title: string
  companyId: string
  companyName: string
  type: OpportunityType
  area: string
  modality: Modality
  level: string
  description: string
  requirements: string[]
  vacancies: number
  deadline: string
  status: OpportunityStatus
  createdAt: string
}

export type ApplicationStatus =
  | 'enviada'
  | 'em_analise'
  | 'pre_selecionado'
  | 'entrevista'
  | 'selecionado'
  | 'nao_selecionado'

export interface Application {
  id: string
  opportunityId: string
  studentId: string
  studentName: string
  status: ApplicationStatus
  message: string
  createdAt: string
  history: { status: ApplicationStatus; at: string }[]
}

export type SkillLevel = 'declarada' | 'comprovada' | 'validada'

export interface Skill {
  name: string
  category: string
  level: SkillLevel
}

export interface Project {
  id: string
  title: string
  description: string
  link?: string
}

export interface StudentProfile {
  userId: string
  name: string
  course: string
  year: string
  location: string
  headline: string
  languages: string[]
  skills: Skill[]
  projects: Project[]
  available: boolean
}

export interface EventItem {
  id: string
  title: string
  type: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  registered: string[]
}

export type CompanyStatus = 'pendente' | 'em_analise' | 'verificada' | 'ativa'

export interface Company {
  id: string
  name: string
  sector: string
  website: string
  status: CompanyStatus
}

export interface AuditEntry {
  id: string
  at: string
  actor: string
  action: string
  detail: string
}
export interface AppNotification {
  id: string
  userId: string
  title: string
  text: string
  link?: string
  read: boolean
  at: string
}

export interface Certificate {
  id: string
  code: string
  studentId: string
  studentName: string
  activity: string
  issuer: string
  issuedAt: string
}
export interface Mentor {
  userId: string
  name: string
  area: string
  company: string
  bio: string
  active: boolean
}

export type MentorshipStatus = 'pendente' | 'aceite' | 'recusada'

export interface MentorshipRequest {
  id: string
  studentId: string
  studentName: string
  mentorId: string
  mentorName: string
  topic: string
  message: string
  status: MentorshipStatus
  createdAt: string
}
export type ChallengeStatus = 'pendente' | 'ativo' | 'encerrado' | 'rejeitado'

export interface Challenge {
  id: string
  title: string
  companyId: string
  companyName: string
  problem: string
  requirements: string[]
  skills: string[]
  deadline: string
  prize: string
  status: ChallengeStatus
  winnerTeamId?: string
  createdAt: string
}

export interface ChallengeTeam {
  id: string
  challengeId: string
  name: string
  members: { id: string; name: string }[]
}

export interface ChallengeSubmission {
  id: string
  challengeId: string
  teamId: string
  teamName: string
  summary: string
  link: string
  score?: number
  feedback?: string
  submittedAt: string
}

export type DebateStatus = 'inscricoes' | 'em_curso' | 'terminado'

export interface DebateContest {
  id: string
  title: string
  description: string
  topics: string[]
  status: DebateStatus
  createdAt: string
}

export interface DebateTeam {
  id: string
  contestId: string
  name: string
  members: { id: string; name: string }[]
}

export interface DebateMatch {
  id: string
  contestId: string
  round: number
  teamAId: string
  teamBId: string
  topic: string
  scoreA?: number
  scoreB?: number
}

export type ComplaintStatus = 'recebida' | 'em_analise' | 'resolvida'

export interface Complaint {
  id: string
  category: string
  description: string
  authorId?: string
  authorName?: string
  status: ComplaintStatus
  response?: string
  createdAt: string
}

export interface ArchiveDoc {
  id: string
  title: string
  category: string
  description: string
  link: string
  uploadedBy: string
  createdAt: string
}
export interface Account {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
}

export interface CompanyProfile {
  companyId: string
  description: string
  location: string
  areas: string
  contactEmail: string
  contactPhone: string
}

export type CourseKind = 'curso' | 'workshop' | 'bootcamp' | 'masterclass'

export interface Course {
  id: string
  title: string
  kind: CourseKind
  description: string
  instructor: string
  startDate: string
  hours: number
  capacity: number
  enrolled: string[]
  completed: string[]
}

export interface NewsItem {
  id: string
  title: string
  category: string
  summary: string
  body: string
  date: string
  published: boolean
}

export interface ImpactStory {
  id: string
  title: string
  personName: string
  role: string
  story: string
  date: string
  published: boolean
}

export interface FeedbackEntry {
  id: string
  kind: 'evento' | 'formacao'
  targetId: string
  targetTitle: string
  userId: string
  userName: string
  ratings: Record<string, number>
  comment: string
  at: string
}

export interface SkillRequest {
  id: string
  userId: string
  userName: string
  skill: string
  evidenceType: string
  evidence: string
  status: 'pendente' | 'aprovada' | 'rejeitada'
  resultLevel?: SkillLevel
  at: string
  decidedAt?: string
}

export interface GraduateProfile {
  userId: string
  name: string
  graduationYear: string
  company: string
  position: string
  bio: string
  offersMentoring: boolean
}
// ANCHOR:types
