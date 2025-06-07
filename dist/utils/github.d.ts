export declare class GitHubService {
    private octokit;
    constructor(token: string);
    verifyOrgMembership(org: string): Promise<boolean>;
    createRepository(org: string, name: string): Promise<string>;
    setupGitHubPages(org: string, repo: string): Promise<void>;
}
