import { Component } from '@angular/core';
import { NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: 'app-select-search-page',
  templateUrl: './select-search-page.component.html',
  styleUrls: ['./select-search-page.component.scss'],
})
export class SelectSearchPageComponent {

  public query: string = '';
  
  public collection: any[];
  public labelAttr: string;

  public altLabelAttr: string;

  // The collection data being presented to user
  public displayedCollection: any[];

  constructor(
    params: NavParams,
    private _viewCtrl: PopoverController,
  ) {
    this.collection = params.get("collection");
    this.labelAttr = params.get("labelAttr");
    this.altLabelAttr = params.get("altLabelAttr");

    this.displayedCollection = this.collection;
  }

  ionViewDidLoad() { }

  /**
   * When an item is selected from list
   */
  onSelect(selectedItem) {
    this._viewCtrl.dismiss(selectedItem);
  }

  highlight(item) {

    if(!this.query || !item) {
      return item;
    }

    let reg = new RegExp(this.query, 'gi'); 

    return item.replace(reg, str => { 
      return '<b>' + str + '</b>'
    });
  }

  /**
   * Display search results based on user input
   */
  searchFilter(event) {
    
    if(!this.collection) {
      return true;
    }
    
    this.query = event.target.value.toLowerCase();

    if(this.query) {
      this.displayedCollection = this.collection.filter((collectionItem) => {

        if(!collectionItem[this.labelAttr]) 
          return null; 
          
        return collectionItem[this.labelAttr].toLowerCase().indexOf(this.query) >= 0 || 
          (this.altLabelAttr && collectionItem[this.altLabelAttr].toLowerCase().indexOf(this.query) >= 0);
      });
    } else {
      this.displayedCollection = this.collection.slice();
    }
  }
}
