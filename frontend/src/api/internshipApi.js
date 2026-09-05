import api from './axiosClient';

export const getInternshipCatalog = async () => (await api.get('/internships/catalog')).data;
export const getMyInternship = async () => (await api.get('/internships/me')).data;
export const getInternshipDashboard = async () => (await api.get('/internships/dashboard')).data;
export const getInternshipTasks = async () => (await api.get('/internships/tasks')).data;
export const createEnrollment = async (payload) => (await api.post('/internships/enrollments', payload)).data;
export const updateEnrollmentDifficulty = async (id, difficultyLevel) => (
  await api.patch(`/internships/enrollments/${id}/difficulty`, { difficulty_level: difficultyLevel })
).data;
export const submitInternshipTask = async (dayNumber, githubUrl) => (
  await api.post('/internships/submissions', { day_number: dayNumber, github_url: githubUrl })
).data;
export const saveStandup = async (payload) => (await api.post('/internships/standups', payload)).data;
export const getInternshipPortfolio = async () => (await api.get('/internships/portfolio')).data;
export const getInternshipCertificates = async () => (await api.get('/internships/certificates')).data;
