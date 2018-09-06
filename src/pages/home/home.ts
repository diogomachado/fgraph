import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // Watch (observando as mudanças)
  data: Observable<any[]>;

  // Referencia lista de vendas firebase
  ref: AngularFireList<any>;

  unidades = [
    { value: "unidade1", name: "Unidade ES" },
    { value: "unidade2", name: "Unidade SP" },
    { value: "unidade3", name: "Unidade RS" },
    { value: "unidade4", name: "Unidade RJ" }
  ]

  // Gráficos
  @ViewChild('graficoCanvas1') graficoCanvas1;
  @ViewChild('graficoCanvas2') graficoCanvas2;

  objChartJS: any;
  objChartJS2: any;

  chartData = null;

  constructor(public navCtrl: NavController, private db: AngularFireDatabase, public loadingCtrl: LoadingController) {
    // Inicializações
    // ...
  }

  coletarValoresGrafico(){

    let acumuladoPorUnidade = {
        "unidade1" : null,
        "unidade2" : null,
        "unidade3" : null,
        "unidade4" : null,
    };

    for (let venda of this.chartData) {
        acumuladoPorUnidade[venda.unidade] += +venda.valor;
    }

    return Object.keys(acumuladoPorUnidade).map(a => acumuladoPorUnidade[a]);
  }

  criarGrafico(data){

    this.chartData = data;

    // Calcular os valores para o grafico
    let chartData = this.coletarValoresGrafico();

    // Criar primeiro grafico
    this.objChartJS = new Chart(this.graficoCanvas1.nativeElement, {
        type: 'bar',
        data: {
            labels: Object.keys(this.unidades).map(a => this.unidades[a].name),
            datasets: [{
                data: chartData
            }]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItems, data) {
                        return 'R$ ' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
                    }
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    ticks: {
                        callback: function (value, index, values) {
                            return 'R$ ' + value;
                        },
                        suggestedMin: 0
                    }
                }]
            },
        }
    });

    // Criar segundo grafico
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    var color = Chart.helpers.color;

    var config = {
        data: {
            datasets: [{
                data: chartData,
                backgroundColor: [
                    color(chartColors.red).alpha(0.5).rgbString(),
                    color(chartColors.orange).alpha(0.5).rgbString(),
                    color(chartColors.yellow).alpha(0.5).rgbString(),
                    color(chartColors.green).alpha(0.5).rgbString(),
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                'ES',
                'SP',
                'RS',
                'RJ'
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right',
            },
            title: {
                display: false,
                text: 'Proximidade da meta'
            },
            scale: {
                ticks: {
                    beginAtZero: true
                },
                reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        }
    };

    this.objChartJS2 = new Chart.PolarArea(this.graficoCanvas2.nativeElement, config);
  }

  atualizarGrafico(data){

    // Atualizei atributo do controller
    this.chartData = data;

    // Calculo do valores e armazena
    let chartData = this.coletarValoresGrafico();

    // Atualização valores chartjs
    this.objChartJS.data.datasets.forEach((dataset) => {
      dataset.data = chartData;
    });

    this.objChartJS2.data.datasets.forEach((dataset) => {
       dataset.data = chartData;
    });

    this.objChartJS.update();
    this.objChartJS2.update();
  }

  // Depois de carregar a página
  ionViewDidLoad() {

    // Exibir carregamento
    let loader = this.loadingCtrl.create({
      content: "Aguarde ...",
      duration: 3000
    });

    loader.present();

    // Referencia para as transacoes de venda
    this.ref = this.db.list("vendas");

    // Qualquer mudança ocorra no Firebase
    this.ref.valueChanges().subscribe(result => {

      // Retira o loading
      loader.dismiss();

      // Se existe dados, eu atualizo, senão crio
      if (this.chartData){
        this.atualizarGrafico(result);
      }else{
        this.criarGrafico(result);
      }

    });


  }

}