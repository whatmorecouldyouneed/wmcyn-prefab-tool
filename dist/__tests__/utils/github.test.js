"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("../../utils/github");
const rest_1 = require("@octokit/rest");
// mock octokit
jest.mock('@octokit/rest');
describe('GitHubService', () => {
    let githubService;
    const mockToken = 'test-token';
    beforeEach(() => {
        jest.clearAllMocks();
        githubService = new github_1.GitHubService(mockToken);
        jest.spyOn(githubService['octokit'].users, 'getAuthenticated').mockResolvedValue({
            data: { login: 'test-user' },
        });
    });
    describe('verifyOrgMembership', () => {
        it('should return true if user is a member of the organization', async () => {
            jest.spyOn(githubService['octokit'].orgs, 'checkMembershipForUser').mockResolvedValue(true);
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
            rest_1.Octokit.mockImplementation(() => mockOctokit);
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
            rest_1.Octokit.mockImplementation(() => mockOctokit);
            await expect(githubService.createRepository('test-org', 'test-repo'))
                .rejects
                .toThrow('Failed to create repository');
        });
    });
});
