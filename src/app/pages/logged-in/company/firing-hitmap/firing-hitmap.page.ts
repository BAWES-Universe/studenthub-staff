import { Component, OnInit } from '@angular/core';
//services
import { FiringHitmapService } from 'src/app/providers/logged-in/firing-hitmap.service';

@Component({
  selector: 'app-firing-hitmap',
  templateUrl: './firing-hitmap.page.html',
  styleUrls: ['./firing-hitmap.page.scss'],
})
export class FiringHitmapPage implements OnInit {

  public borderLimit = false;

  public firingHitmapData = [];

  public loading: boolean = false; 
  
  constructor(
    public firingHitmapService: FiringHitmapService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.firingHitmapService.list().subscribe(data => {
      this.loading = false;
    
      this.firingHitmapData = data;
    });
  }

  logScrolling(e) {
    this.borderLimit = (e.detail.scrollTop > 20);
  }
}
