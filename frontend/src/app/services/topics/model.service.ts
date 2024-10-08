import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Forum, ForumCreate } from 'src/app/interfaces/forum';
import { TopicModel, TopicModelCreated } from 'src/app/interfaces/topic.model';
import { GetTopicModel } from 'src/app/interfaces/get.topic.model';
import { RecentTopicModel } from 'src/app/interfaces/recent.topic.model';

@Injectable({
    providedIn: 'root',
})
export class TopicsService {
    constructor(private http: HttpClient) { }
    header = {
        headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
    };

    public getAllByForumId(forumId: string) {
        return new Promise<TopicModel[]>((resolve, reject) => {
            this.http.get<TopicModel[]>(`${environment.apiUrl}/topics/${forumId}`, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    }
    public getAllByTag(tag: string) {
        return new Promise<TopicModel[]>((resolve, reject) => {
            this.http.get<TopicModel[]>(`${environment.apiUrl}/topics/tag/${tag}`, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    }
    public getAllRecents(quantity: number) {
        return new Promise<RecentTopicModel[]>((resolve, reject) => {
            this.http.get<RecentTopicModel[]>(`${environment.apiUrl}/topics/recents?quantity=${quantity}`, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    }

    public getTopicBySlug(slug: string) {
        return new Promise<GetTopicModel>((resolve, reject) => {
            this.http.get<GetTopicModel>(`${environment.apiUrl}/topics/slug/${slug}`, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    }

    public async createCommentByTopic(slug: string, topicId: number, authorId: number, content: string) {
        await new Promise((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/comments/`, {
                content,
                authorId,
                topicId,
            }, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
        return new Promise<GetTopicModel>((resolve, reject) => {
            this.http.get<GetTopicModel>(`${environment.apiUrl}/topics/slug/${slug}`, this.header).subscribe({
                next: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    }

    public create(model: TopicModelCreated) {
        return new Promise<any>((resolve, reject) => {
            this.http.post(`${environment.apiUrl}/topics`, model, this.header).subscribe((data) => {
                resolve(data);
            }, error => {
                resolve(error);
            });
        });
    }
}
