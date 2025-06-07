import fs from 'fs-extra';
import path from 'path';

export interface ScaffoldOptions {
  projectName: string;
  projectType: 'nextjs' | 'react-native' | 'html';
  useShopify?: boolean;
  useFirebase?: boolean;
  useTesting?: boolean;
  shopifyDomain?: string;
  shopifyToken?: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
}

export class ScaffoldService {
  private templateDir: string;
  private targetDir: string;

  constructor(templateDir: string, targetDir: string) {
    this.templateDir = templateDir;
    this.targetDir = targetDir;
  }

  async scaffoldProject(options: ScaffoldOptions): Promise<void> {
    // create project directory
    await fs.ensureDir(this.targetDir);

    // copy template files
    const templatePath = path.join(this.templateDir, options.projectType);
    await fs.copy(templatePath, this.targetDir);

    // process template files
    await this.processTemplates(options);

    // create .env files if needed
    if (options.useFirebase || options.useShopify) {
      await this.createEnvFiles(options);
    }

    // create package.json
    await this.createPackageJson(options);

    // create .gitignore
    await this.createGitignore();
  }

  private async processTemplates(options: ScaffoldOptions): Promise<void> {
    const files = await this.getAllFiles(this.targetDir);
    
    for (const file of files) {
      // skip test files if testing is not enabled
      if (file.includes('__tests__') && !options.useTesting) {
        await fs.remove(file);
        continue;
      }

      // HTML+CSS special handling
      if (options.projectType === 'html') {
        if (file.endsWith('index.html')) {
          let content = await fs.readFile(file, 'utf-8');
          content = content.replace(/{{projectName}}/g, options.projectName);
          // Inject Shopify script if enabled
          if (options.useShopify && options.shopifyDomain && options.shopifyToken) {
            const shopifyScript = `<script>window.addEventListener('DOMContentLoaded',function(){renderShopifyProducts('${options.shopifyDomain}','${options.shopifyToken}');});</script>`;
            content = content.replace('</body>', `${shopifyScript}\n</body>`);
          }
          await fs.writeFile(file, content);
          continue;
        }
        if (file.endsWith('firebaseConfig.js') && options.useFirebase && options.firebaseConfig) {
          const firebaseConfigObj = JSON.stringify({
            apiKey: options.firebaseConfig.apiKey,
            authDomain: options.firebaseConfig.authDomain,
            projectId: options.firebaseConfig.projectId,
            storageBucket: options.firebaseConfig.storageBucket,
            messagingSenderId: options.firebaseConfig.messagingSenderId,
            appId: options.firebaseConfig.appId,
            measurementId: options.firebaseConfig.measurementId
          }, null, 2);
          const configScript = `window.FIREBASE_CONFIG = ${firebaseConfigObj};`;
          await fs.writeFile(file, configScript);
          continue;
        }
      }
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        let content = await fs.readFile(file, 'utf-8');
        
        // replace template variables
        content = content.replace(/{{projectName}}/g, options.projectName);
        
        // handle conditional imports and features
        if (!options.useFirebase) {
          content = content.replace(/import.*from ['"]\.\.\/firebase.*['"];?\n?/g, '');
          content = content.replace(/import.*from ['"]\.\.\/\.\.\/firebase.*['"];?\n?/g, '');
        }
        
        if (!options.useShopify) {
          content = content.replace(/import.*from ['"]\.\.\/shopify.*['"];?\n?/g, '');
          content = content.replace(/import.*from ['"]\.\.\/\.\.\/shopify.*['"];?\n?/g, '');
        }
        
        await fs.writeFile(file, content);
      }
    }
  }

  private async getAllFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private async createPackageJson(options: ScaffoldOptions): Promise<void> {
    const packageJson = {
      name: options.projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        start: 'expo start',
        android: 'expo start --android',
        ios: 'expo start --ios',
        web: 'expo start --web'
      },
      dependencies: {
        expo: 'latest',
        'expo-status-bar': 'latest',
        react: 'latest',
        'react-native': 'latest'
      },
      devDependencies: {
        '@babel/core': 'latest',
        '@types/react': 'latest',
        typescript: 'latest',
        'react-native-dotenv': 'latest'
      }
    };

    if (options.useFirebase) {
      (packageJson.dependencies as Record<string, string>)['firebase'] = 'latest';
    }

    if (options.useShopify) {
      (packageJson.dependencies as Record<string, string>)['@shopify/shopify-api'] = 'latest';
    }

    if (options.useTesting) {
      (packageJson.devDependencies as Record<string, string>)['@testing-library/react-native'] = 'latest';
    }

    await fs.writeFile(
      path.join(this.targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  private async createGitignore(): Promise<void> {
    const gitignore = [
      '# dependencies',
      '/node_modules',
      '/.pnp',
      '.pnp.js',
      '',
      '# testing',
      '/coverage',
      '',
      '# next.js',
      '/.next/',
      '/out/',
      '',
      '# production',
      '/build',
      '',
      '# misc',
      '.DS_Store',
      '*.pem',
      '',
      '# debug',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '',
      '# local env files',
      '.env*.local',
      '.env.production',
      '',
      '# vercel',
      '.vercel',
      '',
      '# typescript',
      '*.tsbuildinfo',
      'next-env.d.ts'
    ].join('\n');

    await fs.writeFile(
      path.join(this.targetDir, '.gitignore'),
      gitignore
    );
  }

  private async createEnvFiles(options: ScaffoldOptions): Promise<void> {
    const envContent: string[] = [];

    if (options.projectType === 'react-native') {
      if (options.useFirebase && options.firebaseConfig) {
        envContent.push(
          `EXPO_PUBLIC_FIREBASE_API_KEY=${options.firebaseConfig.apiKey}`,
          `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${options.firebaseConfig.authDomain}`,
          `EXPO_PUBLIC_FIREBASE_PROJECT_ID=${options.firebaseConfig.projectId}`,
          `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=${options.firebaseConfig.storageBucket}`,
          `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${options.firebaseConfig.messagingSenderId}`,
          `EXPO_PUBLIC_FIREBASE_APP_ID=${options.firebaseConfig.appId}`,
          `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=${options.firebaseConfig.measurementId}`
        );
      }
      if (options.useShopify && options.shopifyDomain && options.shopifyToken) {
        envContent.push(
          `EXPO_PUBLIC_SHOPIFY_DOMAIN=${options.shopifyDomain}`,
          `EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${options.shopifyToken}`
        );
      }
    } else {
      if (options.useFirebase && options.firebaseConfig) {
        envContent.push(
          `NEXT_PUBLIC_FIREBASE_API_KEY=${options.firebaseConfig.apiKey}`,
          `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${options.firebaseConfig.authDomain}`,
          `NEXT_PUBLIC_FIREBASE_PROJECT_ID=${options.firebaseConfig.projectId}`,
          `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${options.firebaseConfig.storageBucket}`,
          `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${options.firebaseConfig.messagingSenderId}`,
          `NEXT_PUBLIC_FIREBASE_APP_ID=${options.firebaseConfig.appId}`,
          `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${options.firebaseConfig.measurementId}`
        );
      }
      if (options.useShopify && options.shopifyDomain && options.shopifyToken) {
        envContent.push(
          `NEXT_PUBLIC_SHOPIFY_DOMAIN=${options.shopifyDomain}`,
          `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${options.shopifyToken}`
        );
      }
    }

    // write .env.production.example
    await fs.writeFile(
      path.join(this.targetDir, '.env.production.example'),
      envContent.join('\n')
    );
  }
} 