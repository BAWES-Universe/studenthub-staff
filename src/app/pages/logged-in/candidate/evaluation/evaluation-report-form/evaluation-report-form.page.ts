import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CandidateEvaluationService } from "src/app/providers/logged-in/candidate-evaluation.service";
import {AlertController, NavController} from "@ionic/angular";
import {AuthService} from "../../../../../providers/auth.service";


@Component({
  selector: 'app-evaluation-report-form',
  templateUrl: './evaluation-report-form.page.html',
  styleUrls: ['./evaluation-report-form.page.scss'],
})
export class EvaluationReportFormPage implements OnInit {

  public form: FormGroup;
  public department = null;
  public questionList = null;
  public questionAnswer;
  public candidateID;
  public departmentID;
  constructor(
    public activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public candEvalService: CandidateEvaluationService,
  ) { }

  ngOnInit() {
    this.candidateID = this.activatedRoute.snapshot.params['candidateID'];
    this.loadDepartment();

    if (this.departmentID)
      this.loadQuestions(this.departmentID);

    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      dept:['',Validators.required],
      date:['',Validators.required]
    })
  }

  /**
   * lost questions by department
   * @param departmentID
   */
  loadQuestions(departmentID) {
    let param = '&expand=question'
    this.candEvalService.listQuestionByDept(departmentID, 1, param).subscribe(response => {
      this.questionList = response.body;
      this.questionAnswer = this.questionList.map( ques => {
          return {ceq_uuid: ques.ceq_uuid, question: ques.question.question, answer: undefined, rating: undefined}
        }
      )
    })
  }

  /**
   * list department
   */
  loadDepartment() {
    this.candEvalService.listDepartment().subscribe(res => {
      this.department = res;
    })
  }

  save($event) {
    let data = {
      dept:this.form.controls.dept.value,
      date:this.form.controls.date.value,
      questionAnswer:this.questionAnswer,
      candidateID:this.candidateID,
    }
    this.candEvalService.create(data).subscribe(response => {
      this.alertCtrl.create({
        header:response.operation,
        message:this.authService.errorMessage(response.message),
        buttons:[
          {
            text:'Ok',
            role:'cancel',
            handler:() => {
              if (response.operation == 'success') {
                this.navCtrl.back();
              }
            }
          }
        ]
      }).then(alert => alert.present())
    })
  }

  changeDepartment($event) {
    this.loadQuestions($event.detail.value);
  }
}
