"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scaffold_1 = require("../../utils/scaffold");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// mock fs-extra
jest.mock('fs-extra');
describe('ScaffoldService', () => {
    let scaffoldService;
    const mockTemplateDir = '/mock/templates';
    const mockTargetDir = '/mock/target';
    const mockOptions = {
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
        scaffoldService = new scaffold_1.ScaffoldService(mockTemplateDir, mockTargetDir);
    });
    describe('scaffoldProject', () => {
        it('should create project directory and copy templates', async () => {
            // mock fs-extra methods
            fs_extra_1.default.ensureDir.mockResolvedValue(undefined);
            fs_extra_1.default.copy.mockResolvedValue(undefined);
            fs_extra_1.default.readdir.mockResolvedValue([]);
            fs_extra_1.default.writeFile.mockResolvedValue(undefined);
            await scaffoldService.scaffoldProject(mockOptions);
            expect(fs_extra_1.default.ensureDir).toHaveBeenCalledWith(mockTargetDir);
            expect(fs_extra_1.default.copy).toHaveBeenCalledWith(path_1.default.join(mockTemplateDir, mockOptions.projectType), mockTargetDir);
        });
        it('should handle directory creation failure', async () => {
            fs_extra_1.default.ensureDir.mockRejectedValue(new Error('Failed to create directory'));
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
            ].map(file => path_1.default.join(mockTargetDir, file));
            // mock fs methods
            fs_extra_1.default.readdir.mockResolvedValue(mockFiles.map(file => ({ name: file, isDirectory: () => false })));
            fs_extra_1.default.readFile.mockResolvedValue('{{projectName}}');
            fs_extra_1.default.writeFile.mockResolvedValue(undefined);
            await scaffoldService['processTemplates'](mockOptions);
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledTimes(mockFiles.length);
            expect(fs_extra_1.default.readFile).toHaveBeenCalledTimes(mockFiles.length);
        });
        it('should handle file processing errors', async () => {
            const mockFiles = [path_1.default.join(mockTargetDir, 'test.ts')];
            // mock fs methods
            fs_extra_1.default.readdir.mockResolvedValue(mockFiles.map(file => ({ name: file, isDirectory: () => false })));
            fs_extra_1.default.readFile.mockRejectedValue(new Error('Failed to read file'));
            await expect(scaffoldService['processTemplates'](mockOptions))
                .rejects
                .toThrow('Failed to read file');
        });
    });
    describe('createPackageJson', () => {
        it('should create package.json with correct dependencies', async () => {
            await scaffoldService['createPackageJson'](mockOptions);
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockTargetDir, 'package.json'), expect.stringContaining('"name": "test-project"'));
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockTargetDir, 'package.json'), expect.stringContaining('"firebase": "latest"'));
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockTargetDir, 'package.json'), expect.stringContaining('"@shopify/shopify-api": "latest"'));
        });
    });
    describe('createEnvFiles', () => {
        it('should create .env.production.example with correct variables', async () => {
            await scaffoldService['createEnvFiles'](mockOptions);
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockTargetDir, '.env.production.example'), expect.stringContaining('NEXT_PUBLIC_FIREBASE_API_KEY=test-api-key'));
            expect(fs_extra_1.default.writeFile).toHaveBeenCalledWith(path_1.default.join(mockTargetDir, '.env.production.example'), expect.stringContaining('NEXT_PUBLIC_SHOPIFY_DOMAIN=test-store.myshopify.com'));
        });
    });
});
