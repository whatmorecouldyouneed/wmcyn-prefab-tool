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
export declare class ScaffoldService {
    private templateDir;
    private targetDir;
    constructor(templateDir: string, targetDir: string);
    scaffoldProject(options: ScaffoldOptions): Promise<void>;
    private processTemplates;
    private getAllFiles;
    private createPackageJson;
    private createGitignore;
    private createEnvFiles;
}
