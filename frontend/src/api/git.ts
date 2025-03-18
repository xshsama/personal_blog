import { AxiosResponse } from 'axios';
import request from './request';

interface GitCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
}

export function getGitCommits(limit: number = 10): Promise<AxiosResponse<GitCommit[]>> {
    return request({
        url: '/git/commits',
        method: 'get',
        params: { limit },
    })
}