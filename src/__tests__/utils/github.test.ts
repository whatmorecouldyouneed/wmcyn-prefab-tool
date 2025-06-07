import { GitHubService } from '../../utils/github';
import { Octokit } from '@octokit/rest';

// mock octokit
jest.mock('@octokit/rest');

describe('GitHubService', () => {
  let githubService: GitHubService;
  const mockToken = 'test-token';

  beforeEach(() => {
    jest.clearAllMocks();
    githubService = new GitHubService(mockToken);
    jest.spyOn(githubService['octokit'].users, 'getAuthenticated').mockResolvedValue({
      data: { login: 'test-user' },
    } as any);
  });

  describe('verifyOrgMembership', () => {
    it('should return true if user is a member of the organization', async () => {
      jest.spyOn(githubService['octokit'].orgs, 'checkMembershipForUser').mockResolvedValue(true as any);
      const result = await githubService.verifyOrgMembership('test-org');
      expect(result).toBe(true);
    });

    it('should return false if user is not a member of the organization', async () => {
      jest.spyOn(githubService['octokit'].orgs, 'checkMembershipForUser').mockRejectedValue(new Error('Not a member'));
      const result = await githubService.verifyOrgMembership('test-org');
      expect(result).toBe(false);
    });

    it('should return false if an error occurs during membership check', async () => {
      jest.spyOn(githubService['octokit'].orgs, 'checkMembershipForUser').mockRejectedValue(new Error('API error'));
      await expect(githubService.verifyOrgMembership('test-org'))
        .resolves.toBe(false);
    });
  });

  describe('createRepository', () => {
    it('should create repository successfully', async () => {
      const mockRepo = {
        html_url: 'https://github.com/test-org/test-repo'
      };
      const mockOctokit = {
        repos: {
          createInOrg: jest.fn().mockResolvedValue({ data: mockRepo })
        }
      };
      (Octokit as unknown as jest.Mock).mockImplementation(() => mockOctokit);

      const result = await githubService.createRepository('test-org', 'test-repo');
      expect(result).toBe(mockRepo.html_url);
      expect(mockOctokit.repos.createInOrg).toHaveBeenCalledWith({
        org: 'test-org',
        name: 'test-repo',
        private: false,
        auto_init: true
      });
    });

    it('should throw error for repository creation failure', async () => {
      const mockOctokit = {
        repos: {
          createInOrg: jest.fn().mockRejectedValue(new Error('Failed to create repository'))
        }
      };
      (Octokit as unknown as jest.Mock).mockImplementation(() => mockOctokit);

      await expect(githubService.createRepository('test-org', 'test-repo'))
        .rejects
        .toThrow('Failed to create repository');
    });
  });
}); 