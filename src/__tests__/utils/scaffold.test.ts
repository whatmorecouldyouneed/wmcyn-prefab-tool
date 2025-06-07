import { ScaffoldService, ScaffoldOptions } from '../../utils/scaffold';
import fs from 'fs-extra';
import path from 'path';

// mock fs-extra
jest.mock('fs-extra');

describe('ScaffoldService', () => {
  let scaffoldService: ScaffoldService;
  const mockTemplateDir = '/mock/templates';
  const mockTargetDir = '/mock/target';
  const mockOptions: ScaffoldOptions = {
    projectName: 'test-project',
    projectType: 'nextjs',
    useFirebase: true,
    useShopify: true,
    useTesting: true,
    firebaseConfig: {
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-messaging-sender-id',
      appId: 'test-app-id',
      measurementId: 'test-measurement-id'
    },
    shopifyDomain: 'test-store.myshopify.com',
    shopifyToken: 'test-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    scaffoldService = new ScaffoldService(mockTemplateDir, mockTargetDir);
  });

  describe('scaffoldProject', () => {
    it('should create project directory and copy templates', async () => {
      // mock fs-extra methods
      (fs.ensureDir as unknown as jest.Mock).mockResolvedValue(undefined);
      (fs.copy as unknown as jest.Mock).mockResolvedValue(undefined);
      (fs.readdir as unknown as jest.Mock).mockResolvedValue([]);
      (fs.writeFile as unknown as jest.Mock).mockResolvedValue(undefined);

      await scaffoldService.scaffoldProject(mockOptions);

      expect(fs.ensureDir).toHaveBeenCalledWith(mockTargetDir);
      expect(fs.copy).toHaveBeenCalledWith(
        path.join(mockTemplateDir, mockOptions.projectType),
        mockTargetDir
      );
    });

    it('should handle directory creation failure', async () => {
      (fs.ensureDir as unknown as jest.Mock).mockRejectedValue(new Error('Failed to create directory'));

      await expect(scaffoldService.scaffoldProject(mockOptions))
        .rejects
        .toThrow('Failed to create directory');
    });
  });

  describe('processTemplates', () => {
    it('should process template files correctly', async () => {
      const mockFiles = [
        'index.html',
        'package.json',
        '__tests__/test.ts',
        'firebase/config.ts'
      ].map(file => path.join(mockTargetDir, file));

      // mock fs methods
      (fs.readdir as unknown as jest.Mock).mockResolvedValue(mockFiles.map(file => ({ name: file, isDirectory: () => false })));
      (fs.readFile as unknown as jest.Mock).mockResolvedValue('{{projectName}}');
      (fs.writeFile as unknown as jest.Mock).mockResolvedValue(undefined);

      await scaffoldService['processTemplates'](mockOptions);

      expect(fs.writeFile).toHaveBeenCalledTimes(mockFiles.length);
      expect(fs.readFile).toHaveBeenCalledTimes(mockFiles.length);
    });

    it('should handle file processing errors', async () => {
      const mockFiles = [path.join(mockTargetDir, 'test.ts')];

      // mock fs methods
      (fs.readdir as unknown as jest.Mock).mockResolvedValue(mockFiles.map(file => ({ name: file, isDirectory: () => false })));
      (fs.readFile as unknown as jest.Mock).mockRejectedValue(new Error('Failed to read file'));

      await expect(scaffoldService['processTemplates'](mockOptions))
        .rejects
        .toThrow('Failed to read file');
    });
  });

  describe('createPackageJson', () => {
    it('should create package.json with correct dependencies', async () => {
      await scaffoldService['createPackageJson'](mockOptions);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTargetDir, 'package.json'),
        expect.stringContaining('"name": "test-project"')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTargetDir, 'package.json'),
        expect.stringContaining('"firebase": "latest"')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTargetDir, 'package.json'),
        expect.stringContaining('"@shopify/shopify-api": "latest"')
      );
    });
  });

  describe('createEnvFiles', () => {
    it('should create .env.production.example with correct variables', async () => {
      await scaffoldService['createEnvFiles'](mockOptions);

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTargetDir, '.env.production.example'),
        expect.stringContaining('NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key')
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTargetDir, '.env.production.example'),
        expect.stringContaining('NEXT_PUBLIC_SHOPIFY_DOMAIN=test-store.myshopify.com')
      );
    });
  });
}); 