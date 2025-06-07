import { Octokit } from '@octokit/rest';

export class GitHubService {
  private octokit: Octokit;

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async verifyOrgMembership(org: string): Promise<boolean> {
    try {
      const { data: user } = await this.octokit.users.getAuthenticated();
      await this.octokit.orgs.checkMembershipForUser({
        org,
        username: user.login
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async createRepository(org: string, name: string): Promise<string> {
    try {
      const { data: repo } = await this.octokit.repos.createInOrg({
        org,
        name,
        private: false,
        auto_init: true
      });
      return repo.html_url;
    } catch (error: unknown) {
      throw new Error(`Failed to create repository: ${(error as Error).message}`);
    }
  }

  async setupGitHubPages(org: string, repo: string): Promise<void> {
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
    } catch (error: unknown) {
      throw new Error(`Failed to setup GitHub Pages: ${(error as Error).message}`);
    }
  }
} 