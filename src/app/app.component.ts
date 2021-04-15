import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { Solicitacoes } from './model/solicitacoes';
import { SolicitacoesService } from './services/solicitacoes.service';
import { DatePipe } from '@angular/common';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {

  public model = new Solicitacoes();
  public form: FormGroup;

  constructor( private solicitacoesService: SolicitacoesService, private formBuilder: FormBuilder, public datepipe: DatePipe) {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      empresa: [null, [Validators.required]],
      cnpj: [null, [Validators.required]],
      plano: [null, [Validators.required]],
      tarifa: [null, [Validators.required]],
      minutos: [null, [Validators.required]],
      vplano: [null, [Validators.required]],
      dateAdesao: [null, [Validators.required]],
      dateEmissao: [null, []],
    });
  }

  title = 'ItauTel';

  displayedColumns: string[] = ['id', 'empresa', 'plano', 'tarifa', 'minutos', 'valorplano', 'datadeadesao', 'datadeenvio', 'acoes'];

  dataSource;
  selected = 'option2';
  cnpjValido: boolean = true;
  date;
  edita: boolean = false;

  matcher = new MyErrorStateMatcher();

  ngOnInit() {

    console.log(this.form);

    this.getSolicitacoes();

  }

  editar(id: number){

    this.solicitacoesService.SolicitacoesDetalhe(id).subscribe( result => {

      this.model = result;

      this.form.controls["empresa"].setValue(this.model.empresa);
      this.form.controls["cnpj"].setValue(this.model.cnpj);
      this.form.controls["plano"].setValue(this.model.plano);
      this.form.controls["tarifa"].setValue(this.model.tarifa);
      this.form.controls["minutos"].setValue(this.model.minutos);
      this.form.controls["vplano"].setValue(this.model.vplano);
      this.form.controls["dateAdesao"].setValue(this.model.dateAdesao);
      this.form.controls["dateEmisssao"].setValue(this.model.dateEmissao);

      this.edita = true;

      console.log(this.model);

    });
  }

  apagar(id){
    console.log(id);
  }

  ValidaCnpj(cnpj: any) {

    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj == "") return false;
    if (cnpj.length != 14) {
      this.cnpjValido = false;
      return false;
    }
    // LINHA 10 - Elimina CNPJs invalidos conhecidos
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    ) {
      this.cnpjValido = false;
      return false;
    }

    // Valida DVs LINHA 23 -
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) {
      this.cnpjValido = false;
      return false;
    }
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) {
      this.cnpjValido = false;
      return false;
    }
    this.cnpjValido = true;
    return false;
  }

  submitForm(event: any, dados: any) {

    this.date=new Date();
    let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');

    this.model.empresa = dados.empresa;
    this.model.cnpj = dados.cnpj;
    this.model.plano = dados.plano;
    this.model.tarifa = dados.tarifa;
    this.model.minutos = dados.minutos;
    this.model.vplano = dados.vplano;
    this.model.dateAdesao = dados.dateAdesao;

    if(this.edita = false){

      this.model.dateEmissao = latest_date;

      this.solicitacoesService.Save(this.model).then( (result) => {
        console.log(result);

        alert("Salvo com sucesso!");
     });

    } else {

      this.model.dateEmissao = this.model.dateEmissao;

      this.solicitacoesService.Update(this.model).then( (result) => {
        console.log(result);
        this.getSolicitacoes();
        alert("Atualizado com sucesso!")
     });

    }


  }

  getSolicitacoes() {

    this.solicitacoesService.Solicitacoes().subscribe( result => {

      console.log(result);

      this.dataSource = result;

    });

  }

}
