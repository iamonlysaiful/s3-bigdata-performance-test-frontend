import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {

  searchForm: FormGroup;
  buildingList = [];
  objectList = [];
  dfList = [];

  @Output() clickRequest = new EventEmitter();

  constructor(private api: ApiServiceService, private fb: FormBuilder,private _snackbar:MatSnackBar) {
    // this._snackbar.open('Error!!', 'End now', {
    //   duration: 500
    // });
    this.searchForm = this.fb.group({
      buildingId: ['', Validators.required],
      objectId: ['', Validators.required],
      datafieldId: ['', Validators.required],
      daterange: [[new Date(2018, 4, 10, 0, 0), new Date(2018, 4, 12, 23, 59)], Validators.required]
    });
  }

  ngOnInit(): void {
    this.getBuildingsDD();
    this.getObjectsDD();
    this.getDataFieldsDD();
  }

  //======================DD Section===========

  getBuildingsDD() {
    this.api.getBuildingsForDD().subscribe((res) => {
      this.buildingList = res.data.bQuery.buildings;
    });
  }
  getObjectsDD() {
    this.api.getObjectsForDD().subscribe((res) => {
      this.objectList = res.data.objQuery.objects;
    });
  }
  getDataFieldsDD() {
    this.api.getDataFieldsForDD().subscribe((res) => {
      this.dfList = res.data.dfieldQuery.datafields;
    });
  }

  onClick() {
    let formValue = this.searchForm.value;
    this.clickRequest.emit(formValue);
  }

}
