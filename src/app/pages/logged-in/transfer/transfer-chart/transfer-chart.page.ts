import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ModalController, Platform } from '@ionic/angular';
import {CompanyService} from "../../../../providers/logged-in/company.service";

@Component({
  selector: 'app-transfer-chart',
  templateUrl: './transfer-chart.page.html',
  styleUrls: ['./transfer-chart.page.scss'],
})
export class TransferChartPage implements OnInit {

  @ViewChild('statsChart') statsChart;

  public company;

  public statsData: any[];

  public legendDisplay = true;
  public loading = true;

  public borderLimit: boolean = false;

  constructor(
    public platform: Platform,
    public modalCtrl: ModalController,
    public companyService: CompanyService
  ) { }

  ngOnInit() {

    if (this.platform.is('mobile')) {
      this.legendDisplay = false;
    }
  }

  ionViewDidEnter() {
    this.loadData();
  }

  loadChartStats() {
    this.statsData = this.company.parentTransfers.reverse();
    const allTransfers = [];
    const complete = [];
    const paymentReceived = [];
    const inprogress = [];
    const xAxis = [];
    const profit = [];
    const totalCandidates = [];
    const totalCandidatePaid = [];
    const canAvgPayment = [];
    const averageProfitPerCandidate = [];
    const pointBackgroundColors = [];
    if (this.company && this.statsData && this.statsData.length > 0) {
      for (const transfer of this.statsData) {
        // Complete/payment received/inprogress
        if (transfer.transfer_status == 4 || transfer.transfer_status == 1 || transfer.transfer_status == 3) {
          // Complete/payment received/inprogress
          if (transfer.transfer_status == 4) {
            // Complete transfer
            complete.push(transfer.company_total.replace(/,/g, ''));
          }

          if (transfer.transfer_status == 1) {
            // payment received transfer
            paymentReceived.push(transfer.company_total);
          }

          if (transfer.transfer_status == 3) {
            // Inprogress transfer
            inprogress.push(transfer.company_total);
          }


          // one line for profit
          if (transfer.profit) {
            const tProfit = transfer.profit.replace(/,/g, '');
            profit.push(tProfit);
          }

          // one line showing candidates count transferred to in that transfer
          if (transfer.totalCandidateTransferTotal) {
            totalCandidates.push(transfer.totalCandidateTransferTotal);
          }

          // one line for total distributed to candidates
          // let totalPaid = 0;
          // for (const candidatePaid of transfer.paidTransferCandidates) {
          //   totalPaid += candidatePaid.total_paid;
          // }
          totalCandidatePaid.push(transfer.total);

          // average payment per candidate
          canAvgPayment.push((transfer.total / transfer.totalPaid));

          // Also average profit per candidate would be nice
          const profits = 0;
          if (transfer.profit && transfer.paidTransferCandidates && transfer.paidTransferCandidates.length > 0) {
            const profits = transfer.profit.replace(/,/g, '');
            averageProfitPerCandidate.push((profits / transfer.paidTransferCandidates.length));
          }

          allTransfers.push({
            x: transfer.transfer_created_at_unix,
            y: transfer.company_total.replace(/,/g, ''),
            id: '1A',
            transfer_id: transfer.transfer_id,
            total: transfer.company_total,
            status: transfer.transfer_status,
            profit: transfer.profit.replace(/,/g, ''),
            totalCandidateTransferTotal: transfer.totalCandidateTransferTotal,
            totalCandidatePaid: transfer.total,
            canAvgPayment: (transfer.total / transfer.totalPaid),
            averageProfitPerCandidate: (profits / transfer.paidTransferCandidates.length),
          });

          if (transfer.transfer_status == 4) {
            pointBackgroundColors.push('rgb(38, 194, 129)');
          } else if (transfer.transfer_status == 1) {
            pointBackgroundColors.push('#8000ff');
          } else if (transfer.transfer_status == 3) {
            pointBackgroundColors.push('#387ef5');
          }

          // Horizontal line shows transfer date
          xAxis.push(transfer.transfer_created_at_unix);
        }
      }

      this.createStatsChart(
        xAxis, complete, paymentReceived,
        inprogress, profit, totalCandidates,
        totalCandidatePaid, canAvgPayment,
        averageProfitPerCandidate,
        allTransfers,
        pointBackgroundColors
      );
    }
  }

  /**
   * @param xAxis
   * @param complete
   * @param paymentReceived
   * @param inProgress
   * @param profit
   * @param totalCandidates
   * @param totalCandidatePaid
   * @param canAvgPayment
   * @param averageProfitPerCandidate
   * @param allTransfers
   * @param pointBackgroundColors
   */
  createStatsChart(
    xAxis,
    complete,
    paymentReceived,
    inProgress,
    profit,
    totalCandidates,
    totalCandidatePaid,
    canAvgPayment,
    averageProfitPerCandidate,
    allTransfers,
    pointBackgroundColors
  ) {
    new Chart(this.statsChart.nativeElement, {
      type: 'line',
      data: {
        // labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        // https://stackoverflow.com/questions/28159595/chartjs-different-color-per-data-point
        datasets: [
          {
            label: 'Transfers (' + allTransfers.length + ')',
            display: false,
            data: allTransfers,
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBackgroundColors,
            fill: false,
            backgroundColor: 'rgb(38, 194, 129)',
            borderColor: 'rgb(38, 194, 129)',
            borderWidth: 1
          },
          {
            label: 'Profit (' + profit.length + ')',
            fill: false,
            data: profit,
            backgroundColor: 'red',
            borderColor: 'red',
            borderWidth: 1
          }
          , {
            label: 'Total Candidates (' + totalCandidates.length + ')',
            fill: false,
            data: totalCandidates,
            backgroundColor: 'Blue',
            borderColor: 'Blue',
            borderWidth: 1
          }, {
            label: 'Total Candidates Paid (' + totalCandidatePaid.length + ')',
            fill: false,
            data: totalCandidatePaid,
            backgroundColor: '#ffbf00',
            borderColor: '#ffbf00',
            borderWidth: 1
          }, {
            label: 'Average Candidates Payment (' + canAvgPayment.length + ')',
            fill: false,
            data: canAvgPayment,
            backgroundColor: '#F5CAC3',
            borderColor: '#F5CAC3',
            borderWidth: 1
          }
          , {
            label: 'Average Profit Per Candidate (' + averageProfitPerCandidate.length + ')',
            fill: false,
            data: averageProfitPerCandidate,
            backgroundColor: '#00ffff',
            borderColor: '#00ffff',
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: this.legendDisplay,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            // display: false,
            type: 'category',
            labels: xAxis,
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: (value) => {
                return (new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'KWD',
                })).format(value);
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (context) => {

              let label = '';
              // let label = context.label || '';Complete/payment received/inprogress
              if (context.datasetIndex == 0) {
                if (allTransfers[context.index].status == '4') {
                  label += '\nTransfer Completed on ' + context.label + '\n';
                } else if (allTransfers[context.index].status == '1') {
                  label += '\nConfirm Received on ' + context.label + '\n';
                } else if (allTransfers[context.index].status == '3') {
                  label += '\nDistribution in Progress on ' + context.label + '\n';
                }
              }


              if (context.datasetIndex == 1) {
                label += '\nProfit on ' + context.label + '\n';
              } else if (context.datasetIndex == 2) {
                label += '\nTotal Candidates on ' + context.label + '\n';
              } else if (context.datasetIndex == 3) {
                label += '\nTotal Candidates Paid on ' + context.label + '\n';
              } else if (context.datasetIndex == 4) {
                label += '\nAverage Candidates Payment on ' + context.label + '\n';
              } else if (context.datasetIndex == 5) {
                label += '\nAverage Profit Per Candidate on ' + context.label + '\n';
              }

              if (context.datasetIndex == 2) {
                label += 'are ' + allTransfers[context.index].totalCandidateTransferTotal;
              } else if (!isNaN(context.yLabel)) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'KWD'
                }).format(context.yLabel);
              }
              return label;
            }
          }
        }
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }

  loadData() {
    this.companyService.view(this.company.company_id, 'parentTransfers,parentTransfers.profit,parentTransfers.childTransfers,parentTransfers.childTransfers.company,parentTransfers.totalCandidateTransferTotal,parentTransfers.totalPaid,parentTransfers.paidTransferCandidates').subscribe(response => {
      this.loading = false;
      this.company = response;
      this.loadChartStats();
    }, () => {
    });
  }
}
