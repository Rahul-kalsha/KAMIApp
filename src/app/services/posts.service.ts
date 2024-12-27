import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/posts`;

  getPosts(params?: any): Observable<HttpResponse<Post[]>> {
    let httpParams = new HttpParams();
  
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<Post[]>(this.baseUrl, { 
      params: httpParams,
      observe: 'response'  
    });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
}