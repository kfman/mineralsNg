import {Component, Input, OnInit} from '@angular/core';
import {Sample} from '../../models/Sample';

@Component({
  selector: 'app-sample-list',
  templateUrl: './sample-list.component.html',
  styleUrls: ['./sample-list.component.css']
})
export class SampleListComponent implements OnInit {

  @Input() samples: Sample[] = [];
  @Input() showEdit: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
