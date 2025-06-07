"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const rest_1 = require("@octokit/rest");
class GitHubService {
    constructor(token) {
        this.octokit = new rest_1.Octokit({ auth: token });
    }
    async verifyOrgMembership(org) {
        try {
            const { data: user } = await this.octokit.users.getAuthenticated();
            await this.octokit.orgs.checkMembershipForUser({
                org,
                username: user.login
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async createRepository(org, name) {
        try {
            const { data: repo } = await this.octokit.repos.createInOrg({
                org,
                name,
                private: false,
                auto_init: true
            });
            return repo.html_url;
        }
        catch (error) {
            throw new Error(`Failed to create repository: ${error.message}`);
        }
    }
    async setupGitHubPages(org, repo) {
        try {
            // enable github pages
            await this.octokit.repos.createPagesSite({
                owner: org,
                repo,
                source: {
                    branch: 'gh-pages',
                    path: '/'
                }
            });
        }
        catch (error) {
            throw new Error(`Failed to setup GitHub Pages: ${error.message}`);
        }
    }
}
exports.GitHubService = GitHubService;
