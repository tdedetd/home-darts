import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThrowApi } from '@models/throw-api.interface';
import { AroundTheClockParams } from '../models/around-the-clock-params.interface';
import { PlayerApi } from '@models/player-api.interface';
import { aroundTheClockApiUrl } from '@constants/urls/around-the-clock-api-url';

@Injectable()
export class AroundTheClockApiService {
  private readonly apiPrefix = aroundTheClockApiUrl;

  constructor(private http: HttpClient) {}

  public complete(gameId: number): Observable<null> {
    return this.http.put<null>(`${this.apiPrefix}${gameId}/complete`, null);
  }

  public start(params: AroundTheClockParams & { players: PlayerApi['id'][] }): Observable<{ gameId: number }> {
    return this.http.post<{ gameId: number }>(`${this.apiPrefix}start`, params);
  }

  public throw(nominal: number, hit: boolean, gameId: number, playerId: number): Observable<null> {
    return this.http.post<null>(`${this.apiPrefix}${gameId}/throw`, { nominal, hit }, { params: { playerId }});
  }

  public undo(gameId: number): Observable<ThrowApi | null> {
    return this.http.delete<ThrowApi | null>(`${this.apiPrefix}${gameId}/undo`);
  }
}
