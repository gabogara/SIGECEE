const UserManagement = () => import('../users/Management')
const Profile = () => import('../profile/Profile')
const QuestionManagement = () => import('../questions/Management')
const StructManagement = () => import('../structs/Management')
const PopulationManagement = () => import('../populations/Management')
const CensoManagement = () => import('../census/Management')
const SurveyManagement = () => import('../surveys/Management')
const StudiesManagement = () => import('../studies/Management')
//const CreditsManagement = () => import('../credits/Management')
// const Blog2 = () => import('../blog2/Blog')

const routes = [
  { path: '/users', name: 'Gestión de usuarios', component: UserManagement, exact: true },
  { path: '/profile', name: 'Mi perfil', component: Profile },
  { path: '/questions', name: 'Gestión de banco de preguntas', component: QuestionManagement },
  { path: '/structs', name: 'Gestionar estructuras', component: StructManagement },
  { path: '/populations', name: 'Poblaciones', component: PopulationManagement },
  { path: '/census', name: 'Censos', component: CensoManagement },
  { path: '/surveys', name: 'Encuestas', component: SurveyManagement },
  { path: '/studies', name: 'Estudios', component: StudiesManagement },
  //{ path: '/credits', name: 'Créditos', component: CreditsManagement },
  // { path: '/blog2', name: 'Blog2', component: Blog2 },

]

export default routes
