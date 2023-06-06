import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiPrefix, playerId } from '@config';
import { ThrowApi } from '@models/throw-api.interface';
import { AroundTheClockParams } from '../models/around-the-clock-params.interface';

@Injectable()
export class AroundTheClockApiService {
  private readonly apiPrefix = `${apiPrefix}games/around-the-clock/`;

  constructor(private http: HttpClient) {}

  public complete(gameId: number): Observable<void> {
    return this.http.put<void>(`${this.apiPrefix}${gameId}/complete`, null, { params: { playerId }});
  }

  public start(params: AroundTheClockParams): Observable<{ gameId: number }> {
    return this.http.post<{ gameId: number }>(`${this.apiPrefix}start`, params, { params: { playerId }});
  }

  public throw(nominal: number, hit: boolean, gameId: number): Observable<void> {
    return this.http.post<void>(`${this.apiPrefix}${gameId}/throw`, { nominal, hit }, { params: { playerId } });
  }

  public undo(gameId: number): Observable<ThrowApi | null> {
    return this.http.delete<ThrowApi | null>(`${this.apiPrefix}${gameId}/undo`, { params: { playerId } });
  }
}
