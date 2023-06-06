import { Injectable } from '@angular/core';
import { apiPrefix } from '@config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameInfoApi } from '@models/game-info-api.interface';

@Injectable({ providedIn: 'root' })
export class GameApiService {
  private readonly gamesApiUrl = `${apiPrefix}games/`;

  constructor(private http: HttpClient) {}

  public getGameInfo(gameId: number): Observable<GameInfoApi> {
    return this.http.get<GameInfoApi>(`${this.gamesApiUrl}${gameId}`);
  }
}
