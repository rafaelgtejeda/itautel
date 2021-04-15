import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitacoes } from '../model/solicitacoes';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitacoesService {

  constructor(private httpService: HttpService) { }

  public Solicitacoes() {
    return this.httpService.get(`solicitacoes`);
  }

  public SolicitacoesDetalhe(id: number) {
    return this.httpService.get(`solicitacoes/` + id);
  }

  public Save(model: Solicitacoes): Promise<boolean> {
    return this.httpService.post(`solicitacoes`, model).toPromise();
  }

  public Update(model: Solicitacoes): Promise<boolean> {
    return this.httpService.put(`solicitacoes/${model._id}`, model).toPromise();
  }

  public delete(id: number) {
    return this.httpService.get(`solicitacoes/${id}`).toPromise();
  }

}
