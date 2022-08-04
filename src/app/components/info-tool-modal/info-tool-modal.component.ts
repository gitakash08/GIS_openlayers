import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-info-tool-modal',
  templateUrl: './info-tool-modal.component.html',
  styleUrls: ['./info-tool-modal.component.scss']
})
export class InfoToolModalComponent implements OnInit {
  fromPage!: string;
  fromDialog!: string;
  dataInfo: any;
  Name: any;
  District: any;
  State: any;
  Email: any;
  Address: any;
  Mobile:any;
  dataList:any;

  constructor(
    private mapservice: MapService,
    public dialogRef: MatDialogRef<InfoToolModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public mydata: any
  ) { }

  ngOnInit(): void {

    ;
    if (this.mydata.title == 'District') {
      this.Name = this.mydata.tabledata[0].features[0].properties.NAME;
      this.State = this.mydata.tabledata[0].features[0].properties.STATE_UT;
    }
    else if (this.mydata.title == 'ITI Center') {
      this.Name = this.mydata.tabledata[0].features[0].properties.Name;
      this.Email = this.mydata.tabledata[0].features[0].properties.PrincipalE;
      this.Mobile = this.mydata.tabledata[0].features[0].properties.MobileNumb;
      this.Address = this.mydata.tabledata[0].features[0].properties.Address;
      this.mapservice.getCourse(this.mydata.tabledata[0].features[0].properties.CODE,'ITI').subscribe(Response => {
        ;
        this.dataList = Response['data'];
      });
    }
    else if (this.mydata.title == 'JSS Center') {
      this.Name = this.mydata.tabledata[0].features[0].properties.jss_name;
      this.Email = this.mydata.tabledata[0].features[0].properties.email;
      this.Mobile = this.mydata.tabledata[0].features[0].properties.mobile;
      this.Address = this.mydata.tabledata[0].features[0].properties.address_li;
      this.mapservice.getCourse(this.mydata.tabledata[0].features[0].properties.id,'JSS').subscribe(Response => {
        ;
        this.dataList = Response['data'];
      });
    }
    else if (this.mydata.title == 'PMKK Center') {
      ;
      this.Name = this.mydata.tabledata[0].features[0].properties.TCName;
      this.Email = this.mydata.tabledata[0].features[0].properties.TCSPOCEmai;
      this.Mobile = this.mydata.tabledata[0].features[0].properties.TCSPOCMobi;
      this.Address = this.mydata.tabledata[0].features[0].properties.addressLin;
      this.mapservice.getCourse(this.mydata.tabledata[0].features[0].properties.TCID,'SIP1').subscribe(Response => {
        ;
        this.dataList = Response['data'];
      });
    }
    else if (this.mydata.title == 'ITI Candidate') {
      this.Name = this.mydata.tabledata[0].features[0].properties.Instructor;
      this.District = this.mydata.tabledata[0].features[0].properties.DistrictNa;
      this.State = this.mydata.tabledata[0].features[0].properties.StateName;
      this.mapservice.getCourse(this.mydata.tabledata[0].features[0].properties.id,'ITI').subscribe(Response => {
        ;
        this.dataList = Response['data'];
      });
    }
    else if (this.mydata.title == 'PMKK Candidate') {
      this.Name = this.mydata.tabledata[0].features[0].properties.NAME;
      this.State = this.mydata.tabledata[0].features[0].properties.Candidate_;
      this.mapservice.getCourse(this.mydata.tabledata[0].features[0].properties.id,'PMKK').subscribe(Response => {
        ;
        this.dataList = Response['data'];
      });
    }
     
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

}
