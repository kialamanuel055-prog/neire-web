import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { homeByRole } from '@/config/navigation'
import type { Role } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Role[]
    title?: string
  }
}

const publicRoutes: RouteRecordRaw[] = [
  { path: '', name: 'home', component: () => import('@/pages/public/HomePage.vue'), meta: { title: 'Início' } },
  { path: 'entrar', name: 'login', component: () => (import.meta.env.VITE_API_URL ? import('@/pages/public/SignInPage.vue') : import('@/pages/public/LoginPage.vue')), meta: { title: 'Entrar' } },
  { path: 'verificar/:code?', name: 'verify-certificate', component: () => (import.meta.env.VITE_API_URL ? import('@/pages/public/VerifyCertificateApiPage.vue') : import('@/pages/public/VerifyCertificatePage.vue')), meta: { title: 'Verificar certificado' } },
  { path: 'registo', name: 'register', component: () => (import.meta.env.VITE_API_URL ? import('@/pages/public/RegisterApiPage.vue') : import('@/pages/public/RegisterPage.vue')), meta: { title: 'Criar conta' } },
  { path: 'noticias', name: 'news', component: () => import('@/pages/public/NewsPage.vue'), meta: { title: 'Notícias' } },
  // ANCHOR:routes-public
]

const studentRoutes: RouteRecordRaw[] = [
  {
    path: 'estudante',
    name: 'student-dashboard',
    component: () => import('@/pages/student/StudentDashboard.vue'),
    meta: { roles: ['student', 'alumni'], title: 'Painel do Estudante' },
  },
  { path: 'estudante/oportunidades', name: 'student-opportunities', component: () => import('@/pages/student/OpportunitiesPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Oportunidades' } },
  { path: 'estudante/oportunidades/:id', name: 'student-opportunity', component: () => import('@/pages/student/OpportunityDetailPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Oportunidade' } },
  { path: 'estudante/candidaturas', name: 'student-applications', component: () => import('@/pages/student/ApplicationsPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Candidaturas' } },
  { path: 'estudante/perfil', name: 'student-profile', component: () => import('@/pages/student/ProfilePage.vue'), meta: { roles: ['student', 'alumni'], title: 'Perfil' } },
  { path: 'estudante/eventos', name: 'student-events', component: () => import('@/pages/student/EventsPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Eventos' } },
  { path: 'estudante/certificados', name: 'student-certificates', component: () => import('@/pages/student/CertificatesPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Certificados' } },
  { path: 'notificacoes', name: 'notifications', component: () => import('@/pages/shared/NotificationsPage.vue'), meta: { title: 'Notificações' } },
  { path: 'estudante/mentores', name: 'student-mentors', component: () => import('@/pages/student/MentorsPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Mentores' } },
  { path: 'estudante/mentoria', name: 'student-mentorship', component: () => import('@/pages/student/MentorshipPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Mentoria' } },
  { path: 'estudante/networking', name: 'student-networking', component: () => import('@/pages/student/NetworkingPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Networking' } },
  { path: 'estudante/desafios', name: 'student-challenges', component: () => import('@/pages/student/ChallengesPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Desafios' } },
  { path: 'estudante/desafios/:id', name: 'student-challenge', component: () => import('@/pages/student/ChallengeDetailPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Desafio' } },
  { path: 'estudante/debates', name: 'student-debates', component: () => import('@/pages/student/DebatesPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Debates' } },
  { path: 'denuncias', name: 'complaints', component: () => import('@/pages/shared/ComplaintsPage.vue'), meta: { title: 'Denúncias' } },
  { path: 'estudante/academia', name: 'student-academy', component: () => import('@/pages/student/AcademyPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Academia' } },
  { path: 'estudante/alumni', name: 'student-alumni', component: () => import('@/pages/student/AlumniPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Alumni' } },
  { path: 'estudante/competencias', name: 'student-skills', component: () => import('@/pages/student/SkillVerificationPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Verificação de competências' } },
  { path: 'estudante/avaliacoes', name: 'student-feedback', component: () => import('@/pages/student/FeedbackPage.vue'), meta: { roles: ['student', 'alumni'], title: 'Avaliações' } },
  // ANCHOR:routes-student
]

const companyRoutes: RouteRecordRaw[] = [
  {
    path: 'empresa',
    name: 'company-dashboard',
    component: () => import('@/pages/company/CompanyDashboard.vue'),
    meta: { roles: ['company'], title: 'Painel da Empresa' },
  },
  { path: 'empresa/oportunidades', name: 'company-opportunities', component: () => import('@/pages/company/CompanyOpportunitiesPage.vue'), meta: { roles: ['company'], title: 'Oportunidades' } },
  { path: 'empresa/oportunidades/nova', name: 'company-new-opportunity', component: () => import('@/pages/company/NewOpportunityPage.vue'), meta: { roles: ['company'], title: 'Nova oportunidade' } },
  { path: 'empresa/candidaturas', name: 'company-applicants', component: () => import('@/pages/company/CompanyApplicantsPage.vue'), meta: { roles: ['company'], title: 'Candidaturas' } },
  { path: 'empresa/talentos', name: 'company-talents', component: () => import('@/pages/company/TalentBankPage.vue'), meta: { roles: ['company'], title: 'Banco de Talentos' } },
  { path: 'empresa/desafios', name: 'company-challenges', component: () => import('@/pages/company/CompanyChallengesPage.vue'), meta: { roles: ['company'], title: 'Desafios' } },
  { path: 'empresa/perfil', name: 'company-profile', component: () => import('@/pages/company/CompanyProfilePage.vue'), meta: { roles: ['company'], title: 'Perfil da empresa' } },
  // ANCHOR:routes-company
]

const adminRoutes: RouteRecordRaw[] = [
  {
    path: 'admin',
    name: 'admin-dashboard',
    component: () => import('@/pages/admin/AdminDashboard.vue'),
    meta: { roles: ['admin'], title: 'Painel Administrativo' },
  },
  { path: 'admin/oportunidades', name: 'admin-opportunities', component: () => import('@/pages/admin/AdminOpportunitiesPage.vue'), meta: { roles: ['admin'], title: 'Oportunidades' } },
  { path: 'admin/empresas', name: 'admin-companies', component: () => import('@/pages/admin/AdminCompaniesPage.vue'), meta: { roles: ['admin'], title: 'Empresas' } },
  { path: 'admin/eventos', name: 'admin-events', component: () => import('@/pages/admin/AdminEventsPage.vue'), meta: { roles: ['admin'], title: 'Eventos' } },
  { path: 'admin/estudantes', name: 'admin-students', component: () => import('@/pages/admin/AdminStudentsPage.vue'), meta: { roles: ['admin'], title: 'Estudantes' } },
  { path: 'admin/auditoria', name: 'admin-audit', component: () => import('@/pages/admin/AdminAuditPage.vue'), meta: { roles: ['admin'], title: 'Auditoria' } },
  { path: 'admin/certificados', name: 'admin-certificates', component: () => import('@/pages/admin/AdminCertificatesPage.vue'), meta: { roles: ['admin'], title: 'Certificados' } },
  { path: 'admin/desafios', name: 'admin-challenges', component: () => import('@/pages/admin/AdminChallengesPage.vue'), meta: { roles: ['admin'], title: 'Desafios' } },
  { path: 'admin/debates', name: 'admin-debates', component: () => import('@/pages/admin/AdminDebatesPage.vue'), meta: { roles: ['admin'], title: 'Debates' } },
  { path: 'admin/relatorios', name: 'admin-reports', component: () => import('@/pages/admin/AdminReportsPage.vue'), meta: { roles: ['admin'], title: 'Relatórios' } },
  { path: 'admin/arquivo', name: 'admin-archive', component: () => import('@/pages/admin/AdminArchivePage.vue'), meta: { roles: ['admin'], title: 'Arquivo' } },
  { path: 'admin/denuncias', name: 'admin-complaints', component: () => import('@/pages/admin/AdminComplaintsPage.vue'), meta: { roles: ['admin'], title: 'Denúncias' } },
  { path: 'admin/formacao', name: 'admin-academy', component: () => import('@/pages/admin/AdminAcademyPage.vue'), meta: { roles: ['admin'], title: 'Formação' } },
  { path: 'admin/conteudo', name: 'admin-content', component: () => import('@/pages/admin/AdminContentPage.vue'), meta: { roles: ['admin'], title: 'Conteúdo' } },
  { path: 'admin/avaliacoes', name: 'admin-feedback', component: () => import('@/pages/admin/AdminFeedbackPage.vue'), meta: { roles: ['admin'], title: 'Feedback' } },
  { path: 'admin/competencias', name: 'admin-skills', component: () => import('@/pages/admin/AdminSkillsPage.vue'), meta: { roles: ['admin'], title: 'Competências' } },
  { path: 'admin/permissoes', name: 'admin-permissions', component: () => import('@/pages/admin/AdminPermissionsPage.vue'), meta: { roles: ['admin'], title: 'Permissões' } },
  // ANCHOR:routes-admin
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: publicRoutes,
    },
    {
      path: '/app',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: () => {
            const auth = useAuthStore()
            return auth.user ? homeByRole[auth.user.role] : '/entrar'
          },
        },
        ...studentRoutes,
        ...companyRoutes,
        ...adminRoutes,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/public/NotFoundPage.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  const roles = to.meta.roles
  if (roles && auth.user && !roles.includes(auth.user.role)) {
    return homeByRole[auth.user.role]
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · NEIRE` : 'NEIRE'
})

export default router
