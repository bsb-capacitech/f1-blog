export function createMockPost(overrides = {}) {
  return {
    id: 'id_' + Math.random().toString(36).slice(2),
    title: 'Título de teste',
    content: 'Conteúdo'.repeat(10),
    raceSessionKey: '100',
    author: 'Author Teste',
    createdAt: new Date(),
    ...overrides
  }
}
