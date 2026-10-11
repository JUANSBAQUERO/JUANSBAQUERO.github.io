import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/domain/**', 'src/application/**', 'src/infrastructure/**'],
      exclude: ['src/infrastructure/three/PortfolioScene.ts'],
    },
  },
});
