import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { prompt } from 'inquirer';
import { GitHubService } from './utils/github';
import { ScaffoldService, ScaffoldOptions } from './utils/scaffold';
import path from 'path';

const program = new Command();

// initialize the CLI
program
  .name('wmcyn-init')
  .description('WMCYN project initialization tool')
  .version('0.1.0');

// main command
program
  .action(async () => {
    console.log(chalk.blue('🚀 WMCYN Project Initializer'));
    
    // github auth prompt
    const { githubToken } = await prompt([
      {
        type: 'password',
        name: 'githubToken',
        message: 'Please enter your GitHub personal access token:',
        validate: (input) => input.length > 0 || 'Token is required'
      }
    ]);

    const spinner = ora('Verifying GitHub access...').start();
    const githubService = new GitHubService(githubToken);

    try {
      const isMember = await githubService.verifyOrgMembership('whatmorecouldyouneed');
      if (!isMember) {
        throw new Error('Not a member of whatmorecouldyouneed organization');
      }
      spinner.succeed('GitHub access verified');
    } catch (error) {
      spinner.fail('Failed to verify GitHub access');
      console.error(chalk.red('Error: You must be a member of the whatmorecouldyouneed organization'));
      process.exit(1);
    }

    // project metadata prompts
    const { projectName, projectType } = await prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        validate: (input) => {
          if (!input.match(/^[a-z0-9-]+$/)) {
            return 'Project name must be lowercase and contain only letters, numbers, and hyphens';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project are you building?',
        choices: [
          { name: 'Next.js (App Router)', value: 'nextjs' },
          { name: 'React Native (Expo)', value: 'react-native' },
          { name: 'Vanilla HTML + CSS', value: 'html' }
        ]
      }
    ]);

    // create github repo
    spinner.start('Creating GitHub repository...');
    try {
      await githubService.createRepository('whatmorecouldyouneed', projectName);
      spinner.succeed('GitHub repository created');
    } catch (error: unknown) {
      spinner.fail('Failed to create GitHub repository');
      console.error(chalk.red(`Error: Could not create repository: ${(error as Error).message}`));
      process.exit(1);
    }

    // additional prompts based on project type
    const options: ScaffoldOptions = {
      projectName,
      projectType
    };

    if (projectType === 'nextjs') {
      const { useShopify, useFirebase, useTesting } = await prompt([
        {
          type: 'confirm',
          name: 'useShopify',
          message: 'Do you want to integrate Shopify?',
          default: false
        },
        {
          type: 'confirm',
          name: 'useFirebase',
          message: 'Do you want to enable Firebase + mailing list signup?',
          default: false
        },
        {
          type: 'confirm',
          name: 'useTesting',
          message: 'Do you want to set up unit testing with Jest and React Testing Library?',
          default: false
        }
      ]);

      options.useShopify = useShopify;
      options.useFirebase = useFirebase;
      options.useTesting = useTesting;

      if (useShopify) {
        const { shopifyDomain, shopifyToken } = await prompt([
          {
            type: 'input',
            name: 'shopifyDomain',
            message: 'Enter your Shopify domain (e.g. your-store.myshopify.com):',
            validate: (input) => input.length > 0 || 'Domain is required'
          },
          {
            type: 'password',
            name: 'shopifyToken',
            message: 'Enter your Shopify Storefront API token:',
            validate: (input) => input.length > 0 || 'Token is required'
          }
        ]);

        options.shopifyDomain = shopifyDomain;
        options.shopifyToken = shopifyToken;
      }

      if (useFirebase) {
        const firebaseConfig = await prompt([
          {
            type: 'input',
            name: 'apiKey',
            message: 'Enter your Firebase API Key:',
            validate: (input) => input.length > 0 || 'API Key is required'
          },
          {
            type: 'input',
            name: 'authDomain',
            message: 'Enter your Firebase Auth Domain:',
            validate: (input) => input.length > 0 || 'Auth Domain is required'
          },
          {
            type: 'input',
            name: 'projectId',
            message: 'Enter your Firebase Project ID:',
            validate: (input) => input.length > 0 || 'Project ID is required'
          },
          {
            type: 'input',
            name: 'storageBucket',
            message: 'Enter your Firebase Storage Bucket:',
            validate: (input) => input.length > 0 || 'Storage Bucket is required'
          },
          {
            type: 'input',
            name: 'messagingSenderId',
            message: 'Enter your Firebase Messaging Sender ID:',
            validate: (input) => input.length > 0 || 'Messaging Sender ID is required'
          },
          {
            type: 'input',
            name: 'appId',
            message: 'Enter your Firebase App ID:',
            validate: (input) => input.length > 0 || 'App ID is required'
          },
          {
            type: 'input',
            name: 'measurementId',
            message: 'Enter your Firebase Measurement ID:',
            validate: (input) => input.length > 0 || 'Measurement ID is required'
          }
        ]);

        options.firebaseConfig = firebaseConfig;
      }

      const { hasDomain } = await prompt([
        {
          type: 'confirm',
          name: 'hasDomain',
          message: 'Do you already have a domain name?',
          default: false
        }
      ]);

      if (hasDomain) {
        await prompt([
          {
            type: 'list',
            name: 'dnsProvider',
            message: 'Select your DNS provider:',
            choices: ['Cloudflare', 'GoDaddy', 'Namecheap', 'Other']
          },
          {
            type: 'input',
            name: 'zoneFile',
            message: 'Enter your zone file or DNS records (optional):',
            default: ''
          }
        ]);

        // todo: handle dns configuration
      }
    }

    if (projectType === 'react-native') {
      const { useShopify, useFirebase, useTesting } = await prompt([
        {
          type: 'confirm',
          name: 'useShopify',
          message: 'Do you want to integrate Shopify?',
          default: false
        },
        {
          type: 'confirm',
          name: 'useFirebase',
          message: 'Do you want to enable Firebase + mailing list signup?',
          default: false
        },
        {
          type: 'confirm',
          name: 'useTesting',
          message: 'Do you want to set up unit testing with Jest and React Native Testing Library?',
          default: false
        }
      ]);

      options.useShopify = useShopify;
      options.useFirebase = useFirebase;
      options.useTesting = useTesting;

      if (useShopify) {
        const { shopifyDomain, shopifyToken } = await prompt([
          {
            type: 'input',
            name: 'shopifyDomain',
            message: 'Enter your Shopify domain (e.g. your-store.myshopify.com):',
            validate: (input) => input.length > 0 || 'Domain is required'
          },
          {
            type: 'password',
            name: 'shopifyToken',
            message: 'Enter your Shopify Storefront API token:',
            validate: (input) => input.length > 0 || 'Token is required'
          }
        ]);
        options.shopifyDomain = shopifyDomain;
        options.shopifyToken = shopifyToken;
      }

      if (useFirebase) {
        const firebaseConfig = await prompt([
          {
            type: 'input',
            name: 'apiKey',
            message: 'Enter your Firebase API Key:',
            validate: (input) => input.length > 0 || 'API Key is required'
          },
          {
            type: 'input',
            name: 'authDomain',
            message: 'Enter your Firebase Auth Domain:',
            validate: (input) => input.length > 0 || 'Auth Domain is required'
          },
          {
            type: 'input',
            name: 'projectId',
            message: 'Enter your Firebase Project ID:',
            validate: (input) => input.length > 0 || 'Project ID is required'
          },
          {
            type: 'input',
            name: 'storageBucket',
            message: 'Enter your Firebase Storage Bucket:',
            validate: (input) => input.length > 0 || 'Storage Bucket is required'
          },
          {
            type: 'input',
            name: 'messagingSenderId',
            message: 'Enter your Firebase Messaging Sender ID:',
            validate: (input) => input.length > 0 || 'Messaging Sender ID is required'
          },
          {
            type: 'input',
            name: 'appId',
            message: 'Enter your Firebase App ID:',
            validate: (input) => input.length > 0 || 'App ID is required'
          },
          {
            type: 'input',
            name: 'measurementId',
            message: 'Enter your Firebase Measurement ID:',
            validate: (input) => input.length > 0 || 'Measurement ID is required'
          }
        ]);
        options.firebaseConfig = firebaseConfig;
      }
    }

    if (projectType === 'html') {
      const { useShopify, useFirebase } = await prompt([
        {
          type: 'confirm',
          name: 'useShopify',
          message: 'Do you want to integrate Shopify?',
          default: false
        },
        {
          type: 'confirm',
          name: 'useFirebase',
          message: 'Do you want to enable Firebase + mailing list signup?',
          default: false
        }
      ]);

      options.useShopify = useShopify;
      options.useFirebase = useFirebase;

      if (useShopify) {
        const { shopifyDomain, shopifyToken } = await prompt([
          {
            type: 'input',
            name: 'shopifyDomain',
            message: 'Enter your Shopify domain (e.g. your-store.myshopify.com):',
            validate: (input) => input.length > 0 || 'Domain is required'
          },
          {
            type: 'password',
            name: 'shopifyToken',
            message: 'Enter your Shopify Storefront API token:',
            validate: (input) => input.length > 0 || 'Token is required'
          }
        ]);
        options.shopifyDomain = shopifyDomain;
        options.shopifyToken = shopifyToken;
      }

      if (useFirebase) {
        const firebaseConfig = await prompt([
          {
            type: 'input',
            name: 'apiKey',
            message: 'Enter your Firebase API Key:',
            validate: (input) => input.length > 0 || 'API Key is required'
          },
          {
            type: 'input',
            name: 'authDomain',
            message: 'Enter your Firebase Auth Domain:',
            validate: (input) => input.length > 0 || 'Auth Domain is required'
          },
          {
            type: 'input',
            name: 'projectId',
            message: 'Enter your Firebase Project ID:',
            validate: (input) => input.length > 0 || 'Project ID is required'
          },
          {
            type: 'input',
            name: 'storageBucket',
            message: 'Enter your Firebase Storage Bucket:',
            validate: (input) => input.length > 0 || 'Storage Bucket is required'
          },
          {
            type: 'input',
            name: 'messagingSenderId',
            message: 'Enter your Firebase Messaging Sender ID:',
            validate: (input) => input.length > 0 || 'Messaging Sender ID is required'
          },
          {
            type: 'input',
            name: 'appId',
            message: 'Enter your Firebase App ID:',
            validate: (input) => input.length > 0 || 'App ID is required'
          },
          {
            type: 'input',
            name: 'measurementId',
            message: 'Enter your Firebase Measurement ID:',
            validate: (input) => input.length > 0 || 'Measurement ID is required'
          }
        ]);
        options.firebaseConfig = firebaseConfig;
      }
    }

    // scaffold the project
    spinner.start('Scaffolding project...');
    try {
      const scaffoldService = new ScaffoldService(
        path.join(__dirname, 'templates'),
        path.join(process.cwd(), projectName)
      );
      await scaffoldService.scaffoldProject(options);
      spinner.succeed('Project scaffolded successfully');
    } catch (error) {
      spinner.fail('Failed to scaffold project');
      console.error(chalk.red('Error: Could not scaffold project'));
      process.exit(1);
    }

    // final confirmation
    console.log(chalk.green('\n🎉 Project initialized successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Clone your new repository');
    console.log('2. Install dependencies');
    console.log('3. Start developing!');
  });

program.parse(); 