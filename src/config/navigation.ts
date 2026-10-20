import type { Component } from 'vue'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  UserRound,
  CalendarDays,
  Plus,
  Search,
  Users,
  Building2,
  ClipboardList,
  History,
  Award,
  HeartHandshake,
  Network,
  Lightbulb,
  Mic,
  ShieldAlert,
  Archive,
  TrendingUp,
} from 'lucide-vue-next'
import {
  BookOpen as IcoBookOpen,
  GraduationCap as IcoGradCap,
  BadgeCheck as IcoBadgeCheck,
  Star as IcoStar,
  Building2 as IcoBuilding,
  Newspaper as IcoNews,
  ShieldCheck as IcoShield,
} from 'lucide-vue-next'
// ANCHOR:nav-imports
import type { Role } from '@/types'

export interface NavItem {
  label: string
  to: string
  icon: Component
}

export const homeByRole: Record<Role, string> = {
  student: '/app/estudante',
  alumni: '/app/estudante',
  company: '/app/empresa',
  admin: '/app/admin',
}

export const navByRole: Record<Role, NavItem[]> = {
  student: [
    { label: 'Painel', to: '/app/estudante', icon: LayoutDashboard },
    { label: 'Oportunidades', to: '/app/estudante/oportunidades', icon: Briefcase },
    { label: 'Candidaturas', to: '/app/estudante/candidaturas', icon: FileText },
    { label: 'Perfil', to: '/app/estudante/perfil', icon: UserRound },
    { label: 'Eventos', to: '/app/estudante/eventos', icon: CalendarDays },
    { label: 'Desafios', to: '/app/estudante/desafios', icon: Lightbulb },
    { label: 'Debates', to: '/app/estudante/debates', icon: Mic },
    { label: 'Mentores', to: '/app/estudante/mentores', icon: HeartHandshake },
    { label: 'Mentoria', to: '/app/estudante/mentoria', icon: HeartHandshake },
    { label: 'Networking', to: '/app/estudante/networking', icon: Network },
    { label: 'Certificados', to: '/app/estudante/certificados', icon: Award },
    { label: 'Denúncias', to: '/app/denuncias', icon: ShieldAlert },
    { label: 'Academia', to: '/app/estudante/academia', icon: IcoBookOpen },
    { label: 'Alumni', to: '/app/estudante/alumni', icon: IcoGradCap },
    { label: 'Competências', to: '/app/estudante/competencias', icon: IcoBadgeCheck },
    { label: 'Avaliações', to: '/app/estudante/avaliacoes', icon: IcoStar },
    // ANCHOR:nav-student
  ],
  alumni: [
    { label: 'Painel', to: '/app/estudante', icon: LayoutDashboard },
    { label: 'Oportunidades', to: '/app/estudante/oportunidades', icon: Briefcase },
    { label: 'Candidaturas', to: '/app/estudante/candidaturas', icon: FileText },
    { label: 'Perfil', to: '/app/estudante/perfil', icon: UserRound },
    { label: 'Eventos', to: '/app/estudante/eventos', icon: CalendarDays },
    { label: 'Desafios', to: '/app/estudante/desafios', icon: Lightbulb },
    { label: 'Debates', to: '/app/estudante/debates', icon: Mic },
    { label: 'Mentores', to: '/app/estudante/mentores', icon: HeartHandshake },
    { label: 'Mentoria', to: '/app/estudante/mentoria', icon: HeartHandshake },
    { label: 'Networking', to: '/app/estudante/networking', icon: Network },
    { label: 'Certificados', to: '/app/estudante/certificados', icon: Award },
    { label: 'Denúncias', to: '/app/denuncias', icon: ShieldAlert },
    { label: 'Academia', to: '/app/estudante/academia', icon: IcoBookOpen },
    { label: 'Alumni', to: '/app/estudante/alumni', icon: IcoGradCap },
    { label: 'Competências', to: '/app/estudante/competencias', icon: IcoBadgeCheck },
    { label: 'Avaliações', to: '/app/estudante/avaliacoes', icon: IcoStar },
    // ANCHOR:nav-alumni
  ],
  company: [
    { label: 'Painel', to: '/app/empresa', icon: LayoutDashboard },
    { label: 'Oportunidades', to: '/app/empresa/oportunidades', icon: Briefcase },
    { label: 'Nova oportunidade', to: '/app/empresa/oportunidades/nova', icon: Plus },
    { label: 'Candidaturas', to: '/app/empresa/candidaturas', icon: ClipboardList },
    { label: 'Banco de Talentos', to: '/app/empresa/talentos', icon: Search },
    { label: 'Desafios', to: '/app/empresa/desafios', icon: Lightbulb },
    { label: 'Denúncias', to: '/app/denuncias', icon: ShieldAlert },
    { label: 'Perfil da empresa', to: '/app/empresa/perfil', icon: IcoBuilding },
    // ANCHOR:nav-company
  ],
  admin: [
    { label: 'Painel', to: '/app/admin', icon: LayoutDashboard },
    { label: 'Oportunidades', to: '/app/admin/oportunidades', icon: Briefcase },
    { label: 'Empresas', to: '/app/admin/empresas', icon: Building2 },
    { label: 'Eventos', to: '/app/admin/eventos', icon: CalendarDays },
    { label: 'Estudantes', to: '/app/admin/estudantes', icon: Users },
    { label: 'Desafios', to: '/app/admin/desafios', icon: Lightbulb },
    { label: 'Debates', to: '/app/admin/debates', icon: Mic },
    { label: 'Certificados', to: '/app/admin/certificados', icon: Award },
    { label: 'Relatórios', to: '/app/admin/relatorios', icon: TrendingUp },
    { label: 'Arquivo', to: '/app/admin/arquivo', icon: Archive },
    { label: 'Denúncias', to: '/app/admin/denuncias', icon: ShieldAlert },
    { label: 'Auditoria', to: '/app/admin/auditoria', icon: History },
    { label: 'Formação', to: '/app/admin/formacao', icon: IcoBookOpen },
    { label: 'Conteúdo', to: '/app/admin/conteudo', icon: IcoNews },
    { label: 'Feedback', to: '/app/admin/avaliacoes', icon: IcoStar },
    { label: 'Competências', to: '/app/admin/competencias', icon: IcoBadgeCheck },
    { label: 'Permissões', to: '/app/admin/permissoes', icon: IcoShield },
    // ANCHOR:nav-admin
  ],
}
